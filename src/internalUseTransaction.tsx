import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { useContext } from 'react';

export const internalUseTransaction = () => {
    const { signer, address, provider, networkId, defaultFeeCurrency } = useContext(ImpactProviderContext);

    const executeTransaction = async (tx: { data?: string; from?: string; to?: string }) => {
        // TODO: improve gas price validation
        // should be based on network demand

        if (!address) {
            throw new Error('no valid address connected');
        }

        const { celo } = getContracts(provider, networkId);

        // default gas price
        let gasPrice = '5000000000';
        let feeTxParams = {};

        if (defaultFeeCurrency && defaultFeeCurrency.toLowerCase() !== celo.address.toLowerCase()) {
            gasPrice = '15000000000';
            // extra needed tx params
            feeTxParams = {
                feeCurrency: defaultFeeCurrency
            };
        }

        if (!signer) {
            throw new Error('no valid signer connected');
        }

        const txResponse = await signer.sendTransaction({
            data: tx.data,
            from: tx.from || address,
            // gasPrice,
            to: tx.to,
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
