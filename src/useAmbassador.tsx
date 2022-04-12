import { ImpactProviderContext } from './ImpactProvider';
import { communityContract } from './community';
import { executeTransaction } from './executeTransaction';
import { getContracts } from './contracts';
import React from 'react';

export const useAmbassador = () => {
    const { connection, address, provider } = React.useContext(ImpactProviderContext);

    /**
     * Add manager to community
     * @param {string} communityAddress Community address
     * @param {string} managerAddress Manager address to be added
     * @returns {ethers.ContractReceipt} transaction response object
     * @example
     * ```typescript
     * const { addManager } = useAmbassador();
     * const tx = await addManager('community-address', 'manager-address');
     * ```
     */
    const addManager = async (communityAddress: string, managerAddress: string) => {
        if (!connection || !address) {
            return;
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
     * @returns {ethers.ContractReceipt} transaction response object
     */
    const removeManager = async (communityAddress: string, managerAddress: string) => {
        if (!connection || !address) {
            return;
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.removeManager(managerAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Lock community
     * @param {string} communityAddress Community address
     * @returns {ethers.ContractReceipt} transaction response object
     */
    const lockCommunity = async (communityAddress: string) => {
        if (!connection || !address) {
            return;
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.lock();
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Unlock community
     * @param {string} communityAddress Community address
     * @returns {ethers.ContractReceipt} transaction response object
     */
    const unlockCommunity = async (communityAddress: string) => {
        if (!connection || !address) {
            return;
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.unlock();
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    return { addManager, lockCommunity, removeManager, unlockCommunity };
};
