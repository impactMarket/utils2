import { Contract } from '@ethersproject/contracts';
import { ImpactProviderContext } from './ImpactProvider';
import { UserLoans, getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { toToken } from './toToken';
import BaseERC20ABI from './abi/BaseERC20.json';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';

export enum LoanStatus {
    NO_LOAN = 0,
    PENDING_CLAIM = 1,
    LOAN_CLAIMED = 2,
    LOAN_FULL_REPAID = 3
}
export type Loan = {
    amountBorrowed: number;
    amountRepayed: number;
    currentDebt: number;
    dailyInterest: number;
    lastComputedDate: number;
    lastComputedDebt: number;
    // 0 no loan, 1 pending claim, 2 loan claimed, 3 loan full repaid
    loanStatus: LoanStatus;
    period: number;
    repaymentsLength: number;
    startDate: number;
};

export const useBorrower = () => {
    const { provider, address, signer, networkId } = React.useContext(ImpactProviderContext);
    const executeTransaction = internalUseTransaction();
    const [loan, setLoan] = useState<Loan>({
        amountBorrowed: 0,
        amountRepayed: 0,
        currentDebt: 0,
        dailyInterest: 0,
        lastComputedDate: 0,
        lastComputedDebt: 0,
        loanStatus: 0,
        period: 0,
        repaymentsLength: 0,
        startDate: 0
    });

    const [isReady, setIsReady] = useState<boolean>(false);

    /**
     * Approve amount to repay loan
     * @param {string} token token to approve
     * @param {string} amount amount to approve
     * @returns {Promise<CeloTxReceipt>} tx details
     */
    const approve = async (token: string, amount: string) => {
        if (!address || !signer) {
            throw new Error('No wallet connected');
        }

        const { microCredit } = getContracts(provider, networkId);
        const tokenContract = new Contract(token, BaseERC20ABI, provider);
        let actualAmount = toToken(amount);

        if (loan.lastComputedDebt - parseFloat(amount) < 0.01) {
            const loanId = await getActiveLoanId(address);
            const { currentDebt } = await userLoans(address, loanId);

            actualAmount = currentDebt.toString();
        }
        const tx = await tokenContract.populateTransaction.approve(microCredit.address, actualAmount);
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Repay Loan
     * @param {string} loanId id of the loan
     * @param {string} repaymentAmount amount to repay
     * @returns {Promise<CeloTxReceipt>} tx details
     */
    const repayLoan = async (loanId: number, repaymentAmount: string) => {
        if (!address || !signer) {
            throw new Error('No wallet connected');
        }

        const { microCredit } = getContracts(provider, networkId);
        let actualAmount = toToken(repaymentAmount);

        if (loan.lastComputedDebt - parseFloat(repaymentAmount) < 0.01) {
            const loanId = await getActiveLoanId(address);
            const { currentDebt } = await userLoans(address, loanId);

            actualAmount = currentDebt.toString();
        }
        const tx = await microCredit.populateTransaction.repayLoan(loanId, actualAmount);
        const response = await executeTransaction(tx);

        await userLoans(address, loanId);

        return response;
    };

    /**
     * Private method to dedut loan status
     * @param {UserLoans} loan Loan raw data from smart-contract
     * @returns {number} loan status
     */
    const _loanStatus = (loan: UserLoans): number => {
        if (loan.lastComputedDebt.toString() === '0') {
            if (loan.period.toNumber() === 0) {
                return LoanStatus.NO_LOAN;
            } else if (loan.repaymentsLength.toNumber() !== 0) {
                return LoanStatus.LOAN_FULL_REPAID;
            }

            return LoanStatus.PENDING_CLAIM;
        }

        return LoanStatus.LOAN_CLAIMED;
    };

    const updateLoan = (data: UserLoans) => {
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
            currentDebt: toNumber(currentDebt.toString(), { ROUNDING_MODE: BigNumber.ROUND_UP }),
            dailyInterest: toNumber(dailyInterest.toString()),
            lastComputedDate: lastComputedDate.toNumber(),
            lastComputedDebt: toNumber(lastComputedDebt.toString(), { ROUNDING_MODE: BigNumber.ROUND_UP }),
            loanStatus: _loanStatus(data),
            period: period.toNumber(),
            repaymentsLength: repaymentsLength.toNumber(),
            startDate: startDate.toNumber()
        };

        setLoan(formattedData);
    };

    useEffect(() => {
        const loadLoanData = async () => {
            if (!address) {
                return;
            }

            const loanId = await getActiveLoanId(address);

            if (loanId !== -1) {
                userLoans(address, loanId).then(() => setIsReady(true));
            }
        };

        loadLoanData();
    }, [address]);

    /**
     * User Loans
     * @param {string} userAddress Address of the user receiving the loan
     * @param {number} loanId id of the loan
     * @returns {Promise<CeloTxReceipt>} tx details
     */
    const userLoans = async (userAddress: string, loanId: number) => {
        const { microCredit } = getContracts(provider, networkId);

        const response = await microCredit.userLoans(userAddress, loanId);

        updateLoan(response);

        return response;
    };

    /**
     * Claim Loan
     * @param {number} loanId id of the loan being claimed
     * @returns {Promise<TransactionReceipt>} tx details
     */
    const claimLoan = async (loanId: number) => {
        if (!address || !signer) {
            throw new Error('No wallet connected');
        }

        const { microCredit } = getContracts(provider, networkId);
        const tx = await microCredit.populateTransaction.claimLoan(loanId);
        const response = await executeTransaction(tx);

        await userLoans(address, loanId);

        return response;
    };

    /**
     * Get users latest (active) loan Id
     * @param {string} userAddress Address of the user
     * @returns {Promise<number>} tx details
     */
    const getActiveLoanId = async (userAddress: string): Promise<number> => {
        const { microCredit } = getContracts(provider, networkId);
        const response = await microCredit.walletMetadata(userAddress);
        const { loansLength } = response;

        return loansLength.toNumber() - 1;
    };

    return { approve, claimLoan, getActiveLoanId, isReady, loan, repayLoan, userLoans };
};
