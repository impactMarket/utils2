import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toToken } from './toToken';
import React from 'react';

export const useLoanManager = () => {
    const { provider, address, signer, networkId } = React.useContext(ImpactProviderContext);
    const executeTransaction = internalUseTransaction();

    /**
     * Add loans
     * @param {string[]} userAddresses addresses to add loans to
     * @param {number[]} amounts amount of each loan
     * @param {number[]} periods periods of each loan
     * @param {number[]} dailyInterests daily interests of each loan
     * @param {number[]} startDates start dates of each loan
     * @returns {Promise<TransactionReceipt>} tx details
     */
    const addLoans = async (
        userAddresses: string[],
        amounts: number[],
        periods: number[],
        dailyInterests: number[],
        startDates: number[]
    ) => {
        if (!address || !signer) {
            throw new Error('No wallet connected');
        }

        const { microCredit } = getContracts(provider, networkId);
        const tx = await microCredit.populateTransaction.addLoans(
            userAddresses,
            amounts.map(amount => toToken(amount)),
            periods,
            dailyInterests.map(interest => toToken(interest)),
            startDates
        );
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Cancel loans
     * @param {string[]} userAddresses addresses to cancel loans
     * @param {number[]} loansIds ids of each loan
     * @returns {Promise<TransactionReceipt>} tx details
     */
    const cancelLoans = async (userAddresses: string[], loansIds: number[]) => {
        if (!address || !signer) {
            throw new Error('No wallet connected');
        }

        const { microCredit } = getContracts(provider, networkId);
        const tx = await microCredit.populateTransaction.cancelLoans(userAddresses, loansIds);
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Change user address
     * @param {string} oldWalletAddress old wallet address
     * @param {string} newWalletAddress new wallet address
     * @returns {Promise<TransactionReceipt>} tx details
     */
    const changeUserAddress = async (oldWalletAddress: string, newWalletAddress: string) => {
        if (!address || !signer) {
            throw new Error('No wallet connected');
        }

        const { microCredit } = getContracts(provider, networkId);
        const tx = await microCredit.populateTransaction.changeUserAddress(oldWalletAddress, newWalletAddress);
        const response = await executeTransaction(tx);

        return response;
    };

    return { addLoans, cancelLoans, changeUserAddress };
};
