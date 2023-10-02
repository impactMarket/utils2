import { ImpactProviderContext } from './ImpactProvider';
import { TransactionReceipt } from '@ethersproject/providers';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import React from 'react';

export const useAmbassadorEntity = () => {
    const { signer, address, provider, networkId } = React.useContext(ImpactProviderContext);
    const executeTransaction = internalUseTransaction();

    /**
     * Add ambassador entity
     * @param {string} ambassadorAddress Ambassador address to be added
     * @returns {Promise<TransactionReceipt>} transaction response object
     * @throws {Error} "No connection"
     * @example
     * ```typescript
     * const { addAmbassador } = useAmbassadorEntity();
     * const tx = await addAmbassador('ambassador-address');
     * ```
     */
    const addAmbassador = async (ambassadorAddress: string): Promise<TransactionReceipt> => {
        if (!signer || !address) {
            throw new Error('No connection');
        }

        const { ambassadors } = getContracts(provider, networkId);
        const tx = await ambassadors.populateTransaction.addAmbassador(ambassadorAddress);
        const response = await executeTransaction(tx);

        return response;
    };

    return {
        addAmbassador
    };
};
