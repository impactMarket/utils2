import React from 'react';
import { toToken } from '../helpers/toToken';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';
import { toNumber } from '../helpers/toNumber';
import { getContracts } from '../utils/contracts';

type DonationMinerType = {
    approve: Function;
    donateToTreasury: Function;
    donateToCommunity: Function;
};

export const useDonationMiner = (): DonationMinerType => {
    const {
        address,
        signer,
        provider,
        updateCUSDBalance,
        updateRewards,
        updateEpoch
    } = React.useContext(ImpactMarketContext);

    const approve = async (value: string | number) => {
        try {
            const { cusd, donationMiner } = await getContracts(provider);
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
            if (
                !address ||
                !signer ||
                !donationMiner?.provider ||
                !cusd?.provider ||
                !amount
            ) {
                return;
            }

            const cUSDAllowance = await cusd.allowance(
                address,
                donationMiner.address
            );
            const cusdAllowance = toNumber(cUSDAllowance);
            const allowance = cusdAllowance || 0;

            if (allowance >= Number(value)) {
                return { status: true };
            }

            const tx = await cusd
                .connect(signer)
                .approve(donationMiner.address, amount);
            const response = await tx.wait();

            await updateCUSDBalance();

            return response;
        } catch (error) {
            console.log('Error approving amount: \n', error);

            return { status: false };
        }
    };

    const donateToTreasury = async (value: string | number) => {
        try {
            if (!signer) {
                return;
            }
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
            const { donationMiner } = await getContracts(provider);
            const tx = await donationMiner.connect(signer).donate(amount);
            const response = await tx.wait();

            await updateCUSDBalance();
            updateRewards();
            updateEpoch();

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
            if (!signer) {
                return;
            }
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
            const { donationMiner } = await getContracts(provider);
            const tx = await donationMiner
                .connect(signer)
                .donateToCommunity(community, amount);
            const response = await tx.wait();

            await updateCUSDBalance();
            updateRewards();
            updateEpoch();

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
