import { useEffect, useState } from 'react';
import { getContracts } from './contracts';
import { BaseProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import {
    getAllocatedRewards,
    getClaimableRewards,
    getCurrentEpochEstimatedRewards,
    getEstimatedClaimableRewards
} from './updater';

export type RewardsType = {
    allocated: number;
    currentEpoch: number;
    claimable: number;
    estimated: number;
    initialised: boolean;
};

const initialRewards: RewardsType = {
    allocated: 0,
    currentEpoch: 0,
    claimable: 0,
    estimated: 0,
    initialised: false
};
export const useRewards = (props: {
    address: string;
    signer: Signer | null;
    provider: BaseProvider;
}) => {
    const [rewards, setRewards] = useState<RewardsType>(initialRewards);
    const { address, signer, provider } = props;

    const updateRewards = async () => {
        if (!address) {
            return;
        }
        setRewards((rewards: RewardsType) => ({
            ...rewards,
            initialised: false
        }));
        const { donationMiner } = await getContracts(provider);
        const [estimated, claimable, currentEpoch, allocated] =
            await Promise.all([
                getEstimatedClaimableRewards(donationMiner, address),
                getClaimableRewards(donationMiner, address),
                getCurrentEpochEstimatedRewards(donationMiner, address),
                getAllocatedRewards(donationMiner, address)
            ]);

        setRewards((rewards: RewardsType) => ({
            ...rewards,
            estimated,
            claimable,
            currentEpoch,
            allocated,
            initialised: true
        }));
    };

    /**
     * Claims rewards.
     * Should update PACT balance.
     * @returns
     */
    const claimRewards = async () => {
        if (!signer) {
            return;
        }
        try {
            const { donationMiner } = await getContracts(provider);
            const tx = await donationMiner.connect(signer).claimRewards();
            const response = await tx.wait();

            await updateRewards();

            return response;
        } catch (error) {
            console.log('Error in claim function: \n', error);
        }
    };

    useEffect(() => {
        updateRewards();
    }, []);

    return { claimRewards, rewards, updateRewards };
};
