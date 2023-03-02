import { ImpactProviderContext } from './ImpactProvider';
// import { hashMessage } from '@ethersproject/hash';
import { hexlify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import React from 'react';

export const useSignatures = () => {
    const { signer } = React.useContext(ImpactProviderContext);

    /**
     * Signs a given message.
     * ***DO NOT HASH IT***
     * @param {string} message plaintext readable string
     * @returns {Promise<string>} signature
     */
    const signMessage = (message: string): Promise<string> => {
        // const connectionProvider = signer.web3.currentProvider as unknown as {
        //     existingProvider: { isDesktop: boolean; _metamask?: unknown };
        // };

        // // it is not yet clear why, but metamask is not working with hexlify/toUtf8Bytes

        // if (connectionProvider.existingProvider.isDesktop || connectionProvider.existingProvider._metamask) {
        //     return signer.signMessage(hashMessage(message));
        // }

        if (!signer) {
            throw new Error('no valid signer connected');
        }

        return signer.signMessage(hexlify(toUtf8Bytes(message)));
    };

    // TODO: needs further testing
    // works on mobile, but not on desktop. Seems to be an issue with react-celo and metamask
    const signTyped = () => {
        // return signer.signTypedData(address!, {
        //     domain: {
        //         chainId: 44787,
        //         name: 'name',
        //         verifyingContract: '0xB6Fa4E9B48F6fAcd8746573d8e151175c40121C7',
        //         version: '1'
        //     },
        //     message: {
        //         Request: 'This is a request'
        //     },
        //     primaryType: 'Test',
        //     types: {
        //         EIP712Domain: [
        //             { name: 'name', type: 'string' },
        //             { name: 'version', type: 'string' },
        //             { name: 'chainId', type: 'uint256' },
        //             { name: 'verifyingContract', type: 'address' }
        //         ],
        //         Test: [{ name: 'Request', type: 'string' }]
        //     }
        // });
    };

    return { signMessage, signTyped };
};
