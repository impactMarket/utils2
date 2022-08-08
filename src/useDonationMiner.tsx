import { CUSDBalanceContext, EpochContext, ImpactProviderContext, RewardsContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { toToken } from './toToken';
import { updateCUSDBalance } from './useCUSDBalance';
import { updateEpoch } from './useEpoch';
import { updateRewards } from './useRewards';
import React from 'react';

export const useDonationMiner = () => {
    const { provider, connection, address } = React.useContext(ImpactProviderContext);
    const { setEpoch } = React.useContext(EpochContext);
    const { setRewards } = React.useContext(RewardsContext);
    const { setBalance } = React.useContext(CUSDBalanceContext);
    const executeTransaction = internalUseTransaction();

    const approve = async (value: string | number, to?: string) => {
        try {
            const { cusd, donationMiner } = await getContracts(provider);
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });

            if (to === undefined) {
                to = donationMiner.address;
            }
            if (!address || !donationMiner?.provider || !cusd?.provider || !amount) {
                return;
            }

            const cUSDAllowance = await cusd.allowance(address, to);
            const cusdAllowance = toNumber(cUSDAllowance);
            const allowance = cusdAllowance || 0;

            if (allowance >= Number(value)) {
                return { status: true };
            }

            const tx = await cusd.populateTransaction.approve(to, amount);

            return await executeTransaction(tx);
        } catch (error) {
            console.log('Error approving amount: \n', error);

            return { status: false };
        }
    };

    const donateToTreasury = async (value: string | number) => {
        try {
            if (!connection || !address) {
                return;
            }
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
            const { cusd, donationMiner } = await getContracts(provider);

            const tx = await donationMiner.populateTransaction.donate(cusd.address, amount, address);
            const response = await executeTransaction(tx);

            setEpoch(epoch => ({
                ...epoch,
                initialised: false
            }));
            setRewards(rewards => ({
                ...rewards,
                initialised: false
            }));
            const updatedCUSDBalance = await updateCUSDBalance(provider, address);

            setBalance(updatedCUSDBalance);
            updateRewards(provider, address).then(updatedRewards =>
                setRewards(rewards => ({
                    ...rewards,
                    ...updatedRewards,
                    initialised: true
                }))
            );
            updateEpoch(provider, address).then(updatedEpoch =>
                setEpoch(epoch => ({
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

    const donateToCommunity = async (community: string, value: string | number) => {
        try {
            if (!connection || !address) {
                return;
            }
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
            const { cusd, donationMiner } = await getContracts(provider);

            const tx = await donationMiner.populateTransaction.donateToCommunity(
                community,
                cusd.address,
                amount,
                address
            );
            const response = await executeTransaction(tx);

            setEpoch(epoch => ({
                ...epoch,
                initialised: false
            }));
            setRewards(rewards => ({
                ...rewards,
                initialised: false
            }));
            const updatedCUSDBalance = await updateCUSDBalance(provider, address);

            setBalance(updatedCUSDBalance);
            updateRewards(provider, address).then(updatedRewards =>
                setRewards(rewards => ({
                    ...rewards,
                    ...updatedRewards,
                    initialised: true
                }))
            );
            updateEpoch(provider, address).then(updatedEpoch =>
                setEpoch(epoch => ({
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
        donateToTreasury
    };
};
