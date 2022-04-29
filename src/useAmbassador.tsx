import { ImpactProviderContext } from './ImpactProvider';
import { communityContract } from './community';
import { executeTransaction } from './executeTransaction';
import { getContracts } from './contracts';
import React from 'react';
import type { CeloTxReceipt } from '@celo/connect';

export const useAmbassador = () => {
    const { connection, address, provider } = React.useContext(ImpactProviderContext);

    /**
     * Add manager to community
     * @param {string} communityAddress Community address
     * @param {string} managerAddress Manager address to be added
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "No connection"
     * @example
     * ```typescript
     * const { addManager } = useAmbassador();
     * const tx = await addManager('community-address', 'manager-address');
     * ```
     */
    const addManager = async (communityAddress: string, managerAddress: string): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.addManager(managerAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Remove manager from community
     * @param {string} communityAddress Community address
     * @param {string} managerAddress Manager address to be removed
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "No connection"
     */
    const removeManager = async (communityAddress: string, managerAddress: string): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.removeManager(managerAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Lock community
     * @param {string} communityAddress Community address
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "No connection"
     */
    const lockCommunity = async (communityAddress: string): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.lock();
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Unlock community
     * @param {string} communityAddress Community address
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "No connection"
     */
    const unlockCommunity = async (communityAddress: string): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.unlock();
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    return { addManager, lockCommunity, removeManager, unlockCommunity };
};
