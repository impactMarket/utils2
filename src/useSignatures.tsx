import { ImpactProviderContext } from './ImpactProvider';
import { hexlify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import React from 'react';

export const useSignatures = () => {
    const { connection, address } = React.useContext(ImpactProviderContext);

    /**
     * Signs a given message.
     * ***DO NOT HASH IT***
     * @param {string} message plaintext readable string
     * @returns {Promise<string>} signature
     */
    const signMessage = (message: string): Promise<string> => {
        return connection.sign(hexlify(toUtf8Bytes(message)), address!);
    };

    // TODO:
    /* const sign = (message: string) => {
        return connection.signTypedData(getAddress(address!), {
            domain: {
                chainId: 1,
                name: 'name',
                verifyingContract: '0xB6Fa4E9B48F6fAcd8746573d8e151175c40121C7',
                version: '1'
            },
            message: {
                Request: 'This is a request'
            },
            primaryType: 'Test',
            types: {
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' }
                ],
                Test: [{ name: 'Request', type: 'string' }]
            }
        });
    }; */

    return { signMessage };
};
