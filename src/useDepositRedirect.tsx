import { Contract } from '@ethersproject/contracts';
import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { toToken } from './toToken';
import BaseERC20ABI from './abi/BaseERC20.json';
import React, { useEffect } from 'react';

export const useDepositRedirect = () => {
    const { provider, address, connection, networkId } = React.useContext(ImpactProviderContext);
    const executeTransaction = internalUseTransaction();
    // const [interest, setInterest] = React.useState<string>('0');

    const deposit = async (token: string, amount: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { depositRedirect } = getContracts(provider, networkId);
        const tokenContract = new Contract(token, BaseERC20ABI, provider);
        const txApprove = await tokenContract.populateTransaction.approve(depositRedirect.address, toToken(amount));
        
        await executeTransaction(txApprove);
        
        const tx = await depositRedirect.populateTransaction.deposit(token, toToken(amount));
        const response = await executeTransaction(tx);

        return response;
    };

    const withdraw = async (token: string, amount: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { depositRedirect } = getContracts(provider, networkId);
        const tx = await depositRedirect.populateTransaction.withdraw(token, toToken(amount));
        const response = await executeTransaction(tx);

        return response;
    };

    const donateInterest = async (depositor: string, token: string, amount: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { depositRedirect } = getContracts(provider, networkId);
        const tx = await depositRedirect.populateTransaction.donateInterest(depositor, token, toToken(amount));
        const response = await executeTransaction(tx);

        return response;
    };

    // TODO: move to subgraph
    const listTokens = async () => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { depositRedirect } = getContracts(provider, networkId);
        const tokenListLength = await depositRedirect.tokenListLength();
        const tokensLength = tokenListLength.toNumber();
        const tokens: string[] = [];

        for (let index = 0; index < tokensLength; index++) {
            const token = await depositRedirect.tokenListAt(index);

            tokens.push(token);
        }

        return tokens;
    };

    useEffect(() => {
        const load = async () => {
            if (!address || !connection) {
                throw new Error('No wallet connected');
            }
    
            const { depositRedirect } = getContracts(provider, networkId);
            const tokenDepositor = await depositRedirect.tokenDepositor('0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', address);
        
            console.log(toNumber(tokenDepositor.amount), toNumber(tokenDepositor.scaledBalance));

            console.log((await depositRedirect.interest(address, '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', toToken(0.07))).toString());
        }

        load();
    }, []);

    return { deposit, donateInterest, listTokens, withdraw };
};
