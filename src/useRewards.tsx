import { ImpactProviderContext, PACTBalanceContext, RewardsContext } from './ImpactProvider';
import { executeTransaction } from './executeTransaction';
import {
    getAllocatedRewards,
    getClaimableRewards,
    getCurrentEpochEstimatedRewards,
    getEstimatedClaimableRewards
} from './updater';
import { getContracts } from './contracts';
import { updatePACTBalance } from './usePACTBalance';
import React, { useEffect } from 'react';
import type { BaseProvider } from '@ethersproject/providers';

export const updateRewards = async (provider: BaseProvider, address: string) => {
    if (!address) {
        return;
    }
    const { donationMiner } = await getContracts(provider);
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
    const { connection, provider, address } = React.useContext(ImpactProviderContext);
    const { setBalance } = React.useContext(PACTBalanceContext);
    const { rewards, setRewards } = React.useContext(RewardsContext);

    /**
     * Claims rewards.
     * @returns {ethers.TransactionReceipt} transaction response object
     */
    const claim = async () => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        try {
            const { cusd, donationMiner } = await getContracts(provider);
            const tx = await donationMiner.populateTransaction.claimRewards();
            const response = await executeTransaction(connection, address, cusd, tx);

            setRewards(rewards => ({
                ...rewards,
                initialised: false
            }));
            const updatedRewards = await updateRewards(provider, address);

            setRewards(rewards => ({
                ...rewards,
                ...updatedRewards,
                initialised: true
            }));
            const updatedPACTBalance = await updatePACTBalance(provider, address);

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
            updateRewards(provider, address).then(updatedRewards =>
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
