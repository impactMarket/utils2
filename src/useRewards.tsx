import { ImpactProviderContext, PACTBalanceContext, RewardsContext } from './ImpactProvider';
import {
    getAllocatedRewards,
    getClaimableRewards,
    getCurrentEpochEstimatedRewards,
    getEstimatedClaimableRewards
} from './updater';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { updatePACTBalance } from './usePACTBalance';
import React, { useEffect } from 'react';
import type { BaseProvider } from '@ethersproject/providers';

export const updateRewards = async (provider: BaseProvider, networkId: number, address: string) => {
    if (!address) {
        return;
    }
    const { donationMiner } = getContracts(provider, networkId);
    const [estimated, claimable, currentEpoch, allocated] = await Promise.all([
        getEstimatedClaimableRewards(donationMiner, address),
        getClaimableRewards(donationMiner, address),
        getCurrentEpochEstimatedRewards(donationMiner, address),
        getAllocatedRewards(donationMiner, address)
    ]);

    return {
        allocated,
        claimable,
        currentEpoch,
        estimated
    };
};

export const useRewards = () => {
    const { signer, provider, address, networkId } = React.useContext(ImpactProviderContext);
    const { setBalance } = React.useContext(PACTBalanceContext);
    const { rewards, setRewards } = React.useContext(RewardsContext);
    const executeTransaction = internalUseTransaction();

    /**
     * Claims rewards.
     * @returns {ethers.TransactionReceipt} transaction response object
     */
    const claim = async () => {
        if (!signer || !address) {
            throw new Error('No signer');
        }
        try {
            const { donationMiner } = getContracts(provider, networkId);
            const tx = await donationMiner.populateTransaction.claimRewards();
            const response = await executeTransaction(tx);

            setRewards(rewards => ({
                ...rewards,
                initialised: false
            }));
            const updatedRewards = await updateRewards(provider, networkId, address);

            setRewards(rewards => ({
                ...rewards,
                ...updatedRewards,
                initialised: true
            }));
            const updatedPACTBalance = await updatePACTBalance(provider, networkId, address);

            setBalance(updatedPACTBalance);

            return response;
        } catch (error) {
            // console.log('Error in claim function: \n', error);
            setRewards(rewards => ({
                ...rewards,
                initialised: true
            }));
            throw error;
        }
    };

    useEffect(() => {
        if (address) {
            updateRewards(provider, networkId, address).then(updatedRewards =>
                setRewards(rewards => ({
                    ...rewards,
                    ...updatedRewards,
                    initialised: true
                }))
            );
        }
    }, [address]);

    return { claim, rewards };
};
