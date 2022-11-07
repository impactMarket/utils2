import { Contract } from '@ethersproject/contracts';
import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import BaseERC20ABI from './abi/BaseERC20.json';
import React from 'react';

type TokenArgs = {
    address: string;
    name: string;
};

export const useTreasury = () => {
    const { connection, address, provider, networkId } = React.useContext(ImpactProviderContext);

    /**
     * Get list of available community tokens
     * @returns {Promise<{}[]>} array with name(symbol) and address of the available tokens
     */
    const getTokenList = async (): Promise<TokenArgs[]> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }

        let token: TokenArgs;
        const tokens: TokenArgs[] = [];

        try {
            const { treasury } = getContracts(provider, networkId);
            const listLength = await treasury.tokenListLength();

            for (let index = 0; index < listLength; index++) {
                token = await new Promise(resolve => {
                    const tokenAddress = treasury.tokenListAt(index);

                    resolve(tokenAddress);
                })
                    .then(async (tokenAddress: any) => {
                        const tokenContract = new Contract(tokenAddress, BaseERC20ABI, provider);
                        const name = await tokenContract.symbol();

                        return { address: tokenAddress, name };
                    })
                    .then((token: TokenArgs) => token);

                tokens.push(token);
            }
        } catch (error) {
            console.log(`Error fetching community tokens ${error}`);
        }

        return tokens;
    };

    return {
        getTokenList
    };
};
