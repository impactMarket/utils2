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

        const txResponse = await connection.sendTransaction({
            data: tx.data,
            from: tx.from || address,
            gasPrice,
            to: tx.to,
            ...feeTxParams
        });

        return await txResponse.waitReceipt();
    };

    return executeTransaction;
};
