import { ContractAddresses } from './contractAddress';
import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { toToken } from './toToken';
import React, { useEffect } from 'react';

export const useLoanManager = () => {
    const { provider, address, signer, networkId } = React.useContext(ImpactProviderContext);
    const executeTransaction = internalUseTransaction();
    const [isReady, setIsReady] = React.useState<boolean>(false);
    const [managerDetails, setManagerDetails] = React.useState<{
        currentLentAmountLimit: number;
        currentLentAmount: number;
    }>({
        currentLentAmount: 0,
        currentLentAmountLimit: 0
    });

    useEffect(() => {
        const getManagerDetails = async () => {
            if (!address) {
                return;
            }

            const { microCredit, microCreditOld } = getContracts(provider, networkId);
            const version = (await microCredit.getVersion()).toNumber();
            const { currentLentAmount, currentLentAmountLimit } =
                version === 1 ? await microCreditOld.managers(address) : await microCredit.managers(address);

            setManagerDetails({
                currentLentAmount: toNumber(currentLentAmount),
                currentLentAmountLimit: toNumber(currentLentAmountLimit)
            });
            setIsReady(true);
        };

        getManagerDetails();
    }, [address]);

    /**
     * Add loans
     * @param {object[]} loans loans to add
     * @returns {Promise<TransactionReceipt>} tx details
     */
    const addLoans = async (
        loans: {
            userAddress: string;
            amount: number;
            period: number;
            dailyInterest: number;
            claimDeadline: number;
        }[]
    ) => {
        if (!address || !signer) {
            throw new Error('No wallet connected');
        }

        const userAddresses = loans.map(loan => loan.userAddress);
        const tokens = Array(loans.length).fill(ContractAddresses.get(networkId)!.cUSD);
        const amounts = loans.map(loan => toToken(loan.amount));
        const periods = loans.map(loan => loan.period);
        const dailyInterests = loans.map(loan => toToken(loan.dailyInterest));
        const claimDeadlines = loans.map(loan => loan.claimDeadline);

        const { microCredit, microCreditOld } = getContracts(provider, networkId);
        const version = (await microCredit.getVersion()).toNumber();
        const tx =
            version === 1
                ? await microCreditOld.populateTransaction.addLoans(
                      userAddresses,
                      amounts,
                      periods,
                      dailyInterests,
                      claimDeadlines
                  )
                : await microCredit.populateTransaction.addLoans(
                      userAddresses,
                      tokens,
                      amounts,
                      periods,
                      dailyInterests,
                      claimDeadlines
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

    return { addLoans, cancelLoans, changeUserAddress, isReady, managerDetails };
};
