import { Contract } from '@ethersproject/contracts';
import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { toToken } from './toToken';
import BaseERC20ABI from './abi/BaseERC20.json';
import React, { useEffect, useState } from 'react';

interface Loan {
    amountBorrowed: number;
    amountRepayed: number;
    currentDebt: number;
    dailyInterest: number;
    lastComputedDate: string;
    lastComputedDebt: number;
    period: number;
    repaymentsLength: string;
    startDate: number;
}

export const useMicroCredit = () => {
    const { provider, address, connection, networkId } = React.useContext(ImpactProviderContext);
    const executeTransaction = internalUseTransaction();
    const [loan, setLoan] = useState<Loan>({
        amountBorrowed: 0,
        amountRepayed: 0,
        currentDebt: 0,
        dailyInterest: 0,
        lastComputedDate: '0',
        lastComputedDebt: 0,
        period: 0,
        repaymentsLength: '0',
        startDate: 0
    });

    const [isLoaded, setIsLoaded] = useState<boolean>(false);

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

        await userLoans(address, loanId.toString());

        return response;
    };

    const updateLoan = (data: Loan, loanId: string) => {
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
        } = data;

        const formattedData = {
            amountBorrowed: toNumber(amountBorrowed.toString()),
            amountRepayed: toNumber(amountRepayed.toString()),
            currentDebt: toNumber(currentDebt.toString()),
            dailyInterest: toNumber(dailyInterest.toString()),
            lastComputedDate: lastComputedDate.toString(),
            lastComputedDebt: toNumber(lastComputedDebt.toString()),
            loanId: loanId.toString(),
            period: toNumber(period.toString()),
            repaymentsLength: repaymentsLength.toString(),
            startDate: +startDate.toString()
        };

        setLoan(formattedData);
    };

    useEffect(() => {
        const loadLoanData = async () => {
            if (!connection || !address) {
                return;
            }

            const loanId = await getActiveLoanId(address);

            await userLoans(address, loanId.toString()).then(() => setIsLoaded(true));
        };

        loadLoanData();
    }, []);

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

        updateLoan(response, loanId);

        return response;
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

        await userLoans(address, loanId.toString());

        return response;
    };

    /**
     * Get users latest (active) loan Id
     * @param {string} userAddress Address of the user
     * @returns {Promise<CeloTxReceipt>} tx details
     */
    const getActiveLoanId = async (userAddress: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { microCredit } = getContracts(provider, networkId);
        const response = await microCredit.walletMetadata(userAddress);
        const { loansLength } = response;

        return +loansLength.toString() - 1;
    };

    return { approve, claimLoan, getActiveLoanId, isLoaded, loan, repayLoan, userLoans };
};
