import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { useContext } from 'react';

export const internalUseTransaction = () => {
    const { connection, address, provider, networkId, defaultFeeCurrency } = useContext(ImpactProviderContext);

    const executeTransaction = async (tx: { data?: string; from?: string; to?: string }) => {
        // TODO: improve gas price validation
        // should be based on network demand

        if (!address) {
            throw new Error('no valid address connected');
        }

        const { cusd, celo } = getContracts(provider, networkId);

        // default gas price
        let gasPrice = '5000000000';
        let feeTxParams = {};
        const feesInAsset = { CELO: celo, cUSD: cusd };

        if (defaultFeeCurrency !== 'CELO') {
            gasPrice = '15000000000';
            // extra needed tx params
            feeTxParams = {
                feeCurrency: feesInAsset[defaultFeeCurrency].address
            };
        }

        const txParams = {
            data: tx.data,
            from: tx.from || address,
            gasPrice,
            to: tx.to,
            ...feeTxParams
        };
        const txResponse = await connection.sendTransaction(txParams);

        // TODO: short lived debug, to be removed
        console.log({ tx, txParams });

        try {
            if (typeof document !== 'undefined') {
                // I'm on the web!
                import('@sentry/nextjs').then((SentryNextJS) => {
                    SentryNextJS.addBreadcrumb({
                        category: 'blockchain',
                        level: 'info',
                        message: JSON.stringify({ tx, txParams })
                    });
                });
            } else {
                // import('@sentry/react-native').then((SentryReactNative) => SentryReactNative.addBreadcrumb({
                //     category: 'blockchain',
                //     level: 'info',
                //     message: JSON.stringify({ tx, txParams })
                // }));
            }
        } catch (_) {}

        return await txResponse.waitReceipt();
    };

    return executeTransaction;
};
