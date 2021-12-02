import React from 'react';
import { useBalance } from './useBalance';
import { useContracts } from './useContracts';
import { useEpoch } from './useEpoch';
import { useRewards } from './useRewards';
import { toToken } from '../helpers/toToken';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';

type DonationMinerType = {
    approve?: Function;
    donate?: Function;
};

export const useDonationMiner = (): DonationMinerType => {
    const { donationMiner, cusd } = useContracts();
    const { updateRewards } = useRewards();
    const { balance, updateBalance } = useBalance();
    const { updateEpoch } = useEpoch();
    const { address } = React.useContext(ImpactMarketContext);

    const approve = async (value: string | number) => {
        try {
            const amount = toToken(value);
            const allowance = balance?.cusdAllowance || 0;

            if (
                !donationMiner?.address ||
                !address ||
                !amount ||
                !cusd?.address
            ) {
                return;
            }

            if (allowance >= Number(value)) {
                return { status: true };
            }

            const tx = await cusd.approve(donationMiner.address, amount);
            const response = await tx.wait();

            await updateBalance();

            return response;
        } catch (error) {
            console.log('Error approving amount: \n', error);

            return { status: false };
        }
    };

    const donate = async (value: string | number) => {
        try {
            const amount = toToken(value);
            const tx = await donationMiner?.donate(amount);
            const response = await tx.wait();

            await Promise.all([
                updateBalance(),
                updateRewards(),
                updateEpoch()
            ]);

            return response;
        } catch (error) {
            console.log('Error in donate function: \n', error);
        }
    };

    return {
        approve,
        donate
    };
};
