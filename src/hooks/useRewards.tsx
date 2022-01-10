import {
    ImpactMarketContext,
    RewardsType
} from '../components/ImpactMarketProvider';
import React, { useEffect } from 'react';
import { getContracts } from '../utils/contracts';

type UseRewardsType = {
    claimRewards: Function;
    rewards?: RewardsType;
};

export const useRewards = (): UseRewardsType => {
    const { rewards, updateRewards, provider } =
        React.useContext(ImpactMarketContext);

    const claimRewards = async () => {
        try {
            const { donationMiner } = await getContracts(provider);
            const tx = await donationMiner?.claimRewards();
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

    return { claimRewards, rewards };
};
