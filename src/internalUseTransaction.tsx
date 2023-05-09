import * as encoding from '@walletconnect/encoding';
import { Deferrable } from '@ethersproject/properties';
import { ImpactProviderContext } from './ImpactProvider';
import { TransactionReceipt, TransactionRequest } from '@ethersproject/providers';
import { getContracts } from './contracts';
import { useContext } from 'react';
import axios from 'axios';

// some methods copied from walletconnect v2 examples

const apiGetAccountNonce = async (jsonRpcUrl: string, address: string): Promise<number> => {
    const response = await axios.post(jsonRpcUrl, {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        params: [address, 'latest']
    });
    const { result } = response.data;
    const nonce = parseInt(result, 16);

    return nonce;
};

const apiGetGasPrice = async (jsonRpcUrl: string, defaultFeeCurrency: string | undefined): Promise<string> => {
    const response = await axios.post(jsonRpcUrl, {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: defaultFeeCurrency ? [defaultFeeCurrency] : []
    });
    const { result } = response.data;

    return result;
};

export const internalUseTransaction = () => {
    const { signer, address, provider, networkId, defaultFeeCurrency, jsonRpcUrl } = useContext(ImpactProviderContext);

    const formatTransaction = async (tx: {
        data?: string;
        from?: string;
        to?: string;
    }): Promise<Deferrable<TransactionRequest>> => {
        if (!address) {
            return {};
        }

        const [_nonce, _gasPrice, _gasLimit, _value] = await Promise.all([
            apiGetAccountNonce(jsonRpcUrl, tx.from || address),
            apiGetGasPrice(jsonRpcUrl, defaultFeeCurrency),
            provider.estimateGas(tx),
            0
        ]);
        const nonce = encoding.sanitizeHex(encoding.numberToHex(_nonce));
        // gasPrice
        const gasPrice = encoding.sanitizeHex(_gasPrice);
        // gasLimit
        const gasLimit = encoding.sanitizeHex(encoding.numberToHex(_gasLimit.toNumber() * 2));
        // value
        const value = encoding.sanitizeHex(encoding.numberToHex(_value));

        return {
            ...tx,
            from: tx.from || address,
            gasLimit,
            gasPrice,
            nonce,
            value
        };
    };

    const executeTransaction = async (tx: {
        data?: string;
        from?: string;
        to?: string;
    }): Promise<TransactionReceipt> => {
        if (!address) {
            throw new Error('no valid address connected');
        }

        const { celo } = getContracts(provider, networkId);

        // include fee currency on tx parameters
        let feeTxParams = {};

        if (defaultFeeCurrency && defaultFeeCurrency.toLowerCase() !== celo.address.toLowerCase()) {
            feeTxParams = {
                feeCurrency: defaultFeeCurrency
            };
        }

        if (!signer) {
            throw new Error('no valid signer connected');
        }

        const txResponse = await signer.sendTransaction({
            ...(await formatTransaction(tx)),
            ...feeTxParams
        });

        try {
            if (typeof document !== 'undefined') {
                // I'm on the web!
                // import('@sentry/nextjs').then((SentryNextJS) => {
                //     SentryNextJS.addBreadcrumb({
                //         category: 'blockchain',
                //         level: 'info',
                //         message: JSON.stringify({ tx, txParams })
                //     });
                // });
            } else {
                // import('@sentry/react-native').then((SentryReactNative) => SentryReactNative.addBreadcrumb({
                //     category: 'blockchain',
                //     level: 'info',
                //     message: JSON.stringify({ tx, txParams })
                // }));
            }
        } catch (_) {}

        return await txResponse.wait();
    };

    return executeTransaction;
};
