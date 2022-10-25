import { Contract } from '@ethersproject/contracts';
import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import BaseERC20ABI from './abi/BaseERC20.json';
import React from 'react';

export const useTreasury = () => {
    const { connection, address, provider } = React.useContext(ImpactProviderContext);

    /**
     * Get list of available community tokens
     * @returns {Promise<{}[]>} array with title and address of the available tokens
     */
    const getTokenList = async (): Promise<{ address: string; title: string }[]> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }

        const { treasury } = await getContracts(provider);
        const listLength = await treasury.tokenListLength();
        const addresses = [];

        for (let index = 0; index < listLength; index++) {
            addresses.push(treasury.tokenListAt(index));
        }

        const tokenAddresses = await Promise.all(addresses);

        const symbols = tokenAddresses.map(value => {
            const token = new Contract(value, BaseERC20ABI, provider);

            return token.symbol();
        });

        const tokenSymbols = await Promise.all(symbols);

        return tokenSymbols.map((value, idx) => ({ address: tokenAddresses[idx], title: value }));
    };

    return {
        getTokenList
    };
};
