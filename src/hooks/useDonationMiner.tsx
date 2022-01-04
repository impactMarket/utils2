import React from 'react';
import { useBalance } from './useBalance';
import { useEpoch } from './useEpoch';
import { useRewards } from './useRewards';
import { toToken } from '../helpers/toToken';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';

type DonationMinerType = {
    approve: Function;
    donateToTreasury: Function;
    donateToCommunity: Function;
};

export const useDonationMiner = (): DonationMinerType => {
    const { updateRewards } = useRewards();
    const { balance, updateBalance } = useBalance();
    const { updateEpoch } = useEpoch();
    const { address, contracts } = React.useContext(ImpactMarketContext);
    const { donationMiner, cusd } = contracts;

    const approve = async (value: string | number) => {
        try {
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
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

    const donateToTreasury = async (value: string | number) => {
        try {
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
            const tx = await donationMiner?.donate(amount);
            const response = await tx.wait();

            await Promise.all([
                updateBalance(),
                updateRewards(),
                updateEpoch()
            ]);

            return response;
        } catch (error) {
            console.log('Error in donateToTreasury function: \n', error);
        }
    };

    const donateToCommunity = async (
        community: string,
        value: string | number
    ) => {
        try {
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
            const tx = await donationMiner?.donateToCommunity(
                community,
                amount
            );
            const response = await tx.wait();

            await Promise.all([
                updateBalance(),
                updateRewards(),
                updateEpoch()
            ]);

            return response;
        } catch (error) {
            console.log('Error in donateToCommunity function: \n', error);
        }
    };

    return {
        approve,
        donateToTreasury,
        donateToCommunity
    };
};
