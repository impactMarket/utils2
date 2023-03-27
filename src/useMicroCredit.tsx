import { Contract } from '@ethersproject/contracts';
import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { toToken } from './toToken';
import BaseERC20ABI from './abi/BaseERC20.json';
import React from 'react';

export const useMicroCredit = () => {
    const { provider, address, connection, networkId } = React.useContext(ImpactProviderContext);
    const executeTransaction = internalUseTransaction();

    /**
     * Approve amount to repay loan
     * @param {string} token token to approve
     * @param {string} amount amount to approve
     * @returns {Promise<CeloTxReceipt>} tx details
     */
    const approve = async (token: string, amount: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { microCredit } = getContracts(provider, networkId);
        const tokenContract = new Contract(token, BaseERC20ABI, provider);
        const tx = await tokenContract.populateTransaction.approve(microCredit.address, toToken(amount));
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Repay Loan
     * @param {string} loanId id of the loan
     * @param {string} repaymentAmount amount to repay
     * @returns {Promise<CeloTxReceipt>} tx details
     */
    const repayLoan = async (loanId: string, repaymentAmount: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { microCredit } = getContracts(provider, networkId);
        const tx = await microCredit.populateTransaction.repayLoan(loanId, toToken(repaymentAmount));
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * User Loans
     * @param {string} userAddress Address of the user receiving the loan
     * @param {string} loanId id of the loan
     * @returns {Promise<CeloTxReceipt>} tx details
     */
    const userLoans = async (userAddress: string, loanId: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { microCredit } = getContracts(provider, networkId);

        const response = await microCredit.userLoans(userAddress, loanId);

        const {
            amountBorrowed,
            amountRepayed,
            currentDebt,
            dailyInterest,
            lastComputedDate,
            lastComputedDebt,
            period,
            repaymentsLength,
            startDate
        } = response;

        return {
            amountBorrowed: toNumber(amountBorrowed.toString()),
            amountRepayed: toNumber(amountRepayed.toString()),
            currentDebt: toNumber(currentDebt.toString()),
            dailyInterest: toNumber(dailyInterest.toString()),
            lastComputedDebt: lastComputedDebt.toString(),
            lastRepaymentDate: lastComputedDate.toString(),
            period: toNumber(period.toString()),
            repaymentsLength: toNumber(repaymentsLength.toString()),
            startDate: startDate.toString()
        };
    };

    /**
     * Claim Loan
     * @param {string} loanId id of the loan being claimed
     * @returns {Promise<CeloTxReceipt>} tx details
     */
    const claimLoan = async (loanId: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { microCredit } = getContracts(provider, networkId);
        const tx = await microCredit.populateTransaction.claimLoan(loanId);
        const response = await executeTransaction(tx);

        return response;
    };

    return { approve, claimLoan, repayLoan, userLoans };
};
