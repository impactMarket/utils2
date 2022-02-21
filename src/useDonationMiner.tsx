import {
    CUSDBalanceContext,
    EpochContext,
    ImpactProviderContext,
    RewardsContext
} from './ImpactProvider';
import { getContracts } from './contracts';
import { toNumber } from './toNumber';
import { toToken } from './toToken';
import { updateCUSDBalance } from './useCUSDBalance';
import { updateEpoch } from './useEpoch';
import { updateRewards } from './useRewards';
import React from 'react';

export const useDonationMiner = () => {
    const { provider, address, signer } = React.useContext(
        ImpactProviderContext
    );
    const { setEpoch } = React.useContext(EpochContext);
    const { setRewards } = React.useContext(RewardsContext);
    const { setBalance } = React.useContext(CUSDBalanceContext);

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

            return response;
        } catch (error) {
            console.log('Error approving amount: \n', error);

            return { status: false };
        }
    };

    const donateToTreasury = async (value: string | number) => {
        try {
            if (!signer || !address) {
                return;
            }
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
            const { donationMiner } = await getContracts(provider);
            const tx = await donationMiner.connect(signer).donate(amount);
            const response = await tx.wait();

            setEpoch((epoch) => ({
                ...epoch,
                initialised: false
            }));
            setRewards((rewards) => ({
                ...rewards,
                initialised: false
            }));
            const updatedCUSDBalance = await updateCUSDBalance(
                provider,
                address
            );

            setBalance(updatedCUSDBalance);
            updateRewards(provider, address).then((updatedRewards) =>
                setRewards((rewards) => ({
                    ...rewards,
                    ...updatedRewards,
                    initialised: true
                }))
            );
            updateEpoch(provider, address).then((updatedEpoch) =>
                setEpoch((epoch) => ({
                    ...epoch,
                    ...updatedEpoch,
                    initialised: true
                }))
            );

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
            if (!signer || !address) {
                return;
            }
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
            const { donationMiner } = await getContracts(provider);
            const tx = await donationMiner
                .connect(signer)
                .donateToCommunity(community, amount);
            const response = await tx.wait();

            setEpoch((epoch) => ({
                ...epoch,
                initialised: false
            }));
            setRewards((rewards) => ({
                ...rewards,
                initialised: false
            }));
            const updatedCUSDBalance = await updateCUSDBalance(
                provider,
                address
            );

            setBalance(updatedCUSDBalance);
            updateRewards(provider, address).then((updatedRewards) =>
                setRewards((rewards) => ({
                    ...rewards,
                    ...updatedRewards,
                    initialised: true
                }))
            );
            updateEpoch(provider, address).then((updatedEpoch) =>
                setEpoch((epoch) => ({
                    ...epoch,
                    ...updatedEpoch,
                    initialised: true
                }))
            );

            return response;
        } catch (error) {
            console.log('Error in donateToCommunity function: \n', error);
        }
    };

    return {
        approve,
        donateToCommunity,
        donateToTreasury,
    };
};
