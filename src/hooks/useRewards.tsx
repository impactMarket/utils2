import { DaoContext, RewardsType } from '../components/DaoProvider';
import { useBalance } from './useBalance';
import { useContracts } from './useContracts';
import { useContractKit } from '@celo-tools/use-contractkit';
import React, { useEffect } from 'react';
import toNumber from '../helpers/toNumber';

type UseRewardsType = {
    claimRewards?: Function;
    rewards?: RewardsType;
    updateRewards: Function;
};

export const useRewards = (): UseRewardsType => {
    const { address } = useContractKit();
    const { donationMiner } = useContracts();
    const { updateBalance } = useBalance();
    const { rewards, setRewards } = React.useContext(DaoContext);

    const getEstimatedClaimableRewards = async () => {
        try {
            const value = await donationMiner?.estimateClaimableReward(address);

            const estimated = toNumber(value);

            setRewards((rewards: RewardsType) => ({
                ...rewards,
                estimated
            }));
        } catch (error) {
            console.log(
                'Error getting estimated claimable rewards amount: \n',
                error
            );
        }
    };

    const getClaimableRewards = async () => {
        try {
            const value = await donationMiner?.calculateClaimableRewards(
                address
            );

            const claimable = toNumber(value);

            setRewards((rewards: RewardsType) => ({
                ...rewards,
                claimable
            }));
        } catch (error) {
            console.log('Error getting claimable rewards amount: \n', error);
        }
    };

    const updateRewards = async () => {
        await Promise.all([
            getEstimatedClaimableRewards(),
            getClaimableRewards(),
            updateBalance()
        ]);

        setRewards((rewards: RewardsType) => ({
            ...rewards,
            initialised: true
        }));
    };

    const claimRewards = async () => {
        try {
            const tx = await donationMiner?.claimRewards();
            const response = await tx.wait();

            await updateRewards();

            return response;
        } catch (error) {
            console.log('Error in claim function: \n', error);
        }
    };

    useEffect(() => {
        if (!rewards?.initialised && donationMiner) {
            updateRewards();
        }
    }, [donationMiner, rewards?.initialised]);

    return { claimRewards, rewards, updateRewards };
};
