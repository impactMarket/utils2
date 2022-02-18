import React, { useEffect } from 'react';
import { getContracts } from './contracts';
import type { BaseProvider } from '@ethersproject/providers';
import {
    getAllocatedRewards,
    getClaimableRewards,
    getCurrentEpochEstimatedRewards,
    getEstimatedClaimableRewards
} from './updater';
import { updatePACTBalance } from './usePACTBalance';
import {
    ImpactProviderContext,
    RewardsContext,
    PACTBalanceContext
} from './ImpactProvider';

export const updateRewards = async (
    provider: BaseProvider,
    address: string
) => {
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
        estimated,
        claimable,
        currentEpoch,
        allocated
    };
};

export const useRewards = () => {
    const { provider, address, signer } = React.useContext(
        ImpactProviderContext
    );
    const { setBalance } = React.useContext(PACTBalanceContext);
    const { rewards, setRewards } = React.useContext(RewardsContext);

    /**
     * Claims rewards.
     * @returns
     */
    const claimRewards = async () => {
        if (!signer || !address) {
            return;
        }
        try {
            const { donationMiner } = await getContracts(provider);
            const tx = await donationMiner.connect(signer).claimRewards();
            const response = await tx.wait();

            setRewards((rewards) => ({
                ...rewards,
                initialised: false
            }));
            const updatedRewards = await updateRewards(provider, address);
            setRewards((rewards) => ({
                ...rewards,
                ...updatedRewards,
                initialised: true
            }));
            const updatedPACTBalance = await updatePACTBalance(
                provider,
                address
            );
            setBalance(updatedPACTBalance);

            return response;
        } catch (error) {
            console.log('Error in claim function: \n', error);
            setRewards((rewards) => ({
                ...rewards,
                initialised: true
            }));
        }
    };

    useEffect(() => {
        if (address) {
            updateRewards(provider, address).then((updatedRewards) =>
                setRewards((rewards) => ({
                    ...rewards,
                    ...updatedRewards,
                    initialised: true
                }))
            );
        }
    }, [address]);

    return { claimRewards, rewards };
};
