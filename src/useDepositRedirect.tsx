import { Contract } from '@ethersproject/contracts';
import { ImpactProviderContext } from './ImpactProvider';
import { UserDepositAsset } from './subgraphs';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { toToken } from './toToken';
import BaseERC20ABI from './abi/BaseERC20.json';
import React, { useEffect } from 'react';

type UserDeposit = UserDepositAsset & { availableInterest: number };

export const useDepositRedirect = () => {
    const { provider, address, connection, networkId, subgraph } = React.useContext(ImpactProviderContext);
    const executeTransaction = internalUseTransaction();
    const [userDeposits, setUserDeposits] = React.useState<UserDeposit[]>([]);
    const [isReady, setIsReady] = React.useState(false);

    /**
     * Approve token for deposit
     * @param {string} token token to approve
     * @param {string} amount amount to approve
     * @returns {Promise<CeloTxReceipt>} tx details
     */
    const approve = async (token: string, amount: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { depositRedirect } = getContracts(provider, networkId);
        const tokenContract = new Contract(token, BaseERC20ABI, provider);
        const tx = await tokenContract.populateTransaction.approve(depositRedirect.address, toToken(amount));
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Deposit token
     * @param {string} token token to deposit
     * @param {string} amount amount to deposit
     * @returns {Promise<CeloTxReceipt>} tx details
     */
    const deposit = async (token: string, amount: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { depositRedirect } = getContracts(provider, networkId);
        const tx = await depositRedirect.populateTransaction.deposit(token, toToken(amount));
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Withdraw token
     * @param {string} token token to withdraw
     * @param {string} amount amount to withdraw
     * @returns {Promise<CeloTxReceipt>} tx details
     */
    const withdraw = async (token: string, amount: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { depositRedirect } = getContracts(provider, networkId);
        const tx = await depositRedirect.populateTransaction.withdraw(token, toToken(amount));
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Donate interest token
     * @param {string} depositor user who's donating interest
     * @param {string} token token interest to be donated
     * @param {string} amount amount of interest to be donate
     * @returns {Promise<CeloTxReceipt>} tx details
     */
    const donateInterest = async (depositor: string, token: string, amount: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { depositRedirect } = getContracts(provider, networkId);
        const tx = await depositRedirect.populateTransaction.donateInterest(depositor, token, toToken(amount));
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * List tokens that can be deposited
     * @returns {Promise<DepositRedirectToken[]>} list of tokens that can be deposited
     */
    const listTokens = () => {
        if (!connection) {
            throw new Error('No connection');
        }

        return subgraph.getDepositRedirectTokens();
    };

    useEffect(() => {
        const load = async () => {
            if (!address || !connection) {
                throw new Error('No wallet connected');
            }

            const { depositRedirect } = getContracts(provider, networkId);

            const rawUserDeposits = await subgraph.getUserDeposits(address);
            const userDeposits_: UserDeposit[] = [];

            for (let index = 0; index < rawUserDeposits.length; index++) {
                const { asset, deposited } = rawUserDeposits[index];
                const availableInterest = await depositRedirect.interest(address, asset, toToken(deposited));

                userDeposits_.push({
                    ...rawUserDeposits[index],
                    availableInterest: toNumber(availableInterest.toString())
                });
            }

            setUserDeposits(userDeposits_);
            setIsReady(true);
        };

        load();
    }, []);

    return { approve, deposit, donateInterest, isReady, listTokens, userDeposits, withdraw };
};
