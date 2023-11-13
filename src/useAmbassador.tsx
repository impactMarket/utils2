import { ImpactProviderContext } from './ImpactProvider';
import { TransactionReceipt } from 'viem';
import { communityContract } from './community';
import { internalUseTransaction } from './internalUseTransaction';
import React from 'react';

export const useAmbassador = () => {
    const { signer, address, provider, subgraph } = React.useContext(ImpactProviderContext);
    const executeTransaction = internalUseTransaction();

    /**
     * Add manager to community
     * @param {string} communityAddress Community address
     * @param {string} managerAddress Manager address to be added
     * @returns {Promise<TransactionReceipt>} transaction response object
     * @throws {Error} "No connection"
     * @example
     * ```typescript
     * const { addManager } = useAmbassador();
     * const tx = await addManager('community-address', 'manager-address');
     * ```
     */
    const addManager = async (communityAddress: string, managerAddress: string): Promise<TransactionReceipt> => {
        if (!signer || !address) {
            throw new Error('No connection');
        }
        const tx = await communityContract(communityAddress).populateTransaction.addManager(managerAddress);
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Remove manager from community
     * @param {string} communityAddress Community address
     * @param {string} managerAddress Manager address to be removed
     * @returns {Promise<TransactionReceipt>} transaction response object
     * @throws {Error} "No connection"
     */
    const removeManager = async (communityAddress: string, managerAddress: string): Promise<TransactionReceipt> => {
        if (!signer || !address) {
            throw new Error('No connection');
        }
        const tx = await communityContract(communityAddress).populateTransaction.removeManager(managerAddress);
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Lock community
     * @param {string} communityAddress Community address
     * @returns {Promise<TransactionReceipt>} transaction response object
     * @throws {Error} "No connection"
     */
    const lockCommunity = async (communityAddress: string): Promise<TransactionReceipt> => {
        if (!signer || !address) {
            throw new Error('No connection');
        }
        const tx = await communityContract(communityAddress).populateTransaction.lock();
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Unlock community
     * @param {string} communityAddress Community address
     * @returns {Promise<TransactionReceipt>} transaction response object
     * @throws {Error} "No connection"
     */
    const unlockCommunity = async (communityAddress: string): Promise<TransactionReceipt> => {
        if (!signer || !address) {
            throw new Error('No connection');
        }
        const tx = await communityContract(communityAddress).populateTransaction.unlock();
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Update max number of beneficiaries in the community
     * @param {string} communityAddress Community address
     * @param {string} maxBeneficiaries Maximum number of beneficiaries in the community
     * @returns {Promise<TransactionReceipt>} transaction response object
     * @throws {Error} "No connection"
     */
    const updateMaxBeneficiaries = async (
        communityAddress: string,
        maxBeneficiaries: number
    ): Promise<TransactionReceipt> => {
        if (!signer || !address) {
            throw new Error('No connection');
        }
        const tx =
            await communityContract(communityAddress).populateTransaction.updateMaxBeneficiaries(maxBeneficiaries);
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Get max number of beneficiaries in the community
     * @param {string} communityAddress Community address
     * @returns {Promise<Number>} Maximum number of beneficiaries
     * @throws {Error} "No connection"
     */
    const getMaxBeneficiaries = async (communityAddress: string): Promise<number> => {
        if (!signer || !address) {
            throw new Error('No connection');
        }
        const max = await subgraph.getCommunityData(communityAddress, '{ maxBeneficiaries }');

        return max.maxBeneficiaries!;
    };

    /**
     * Get if the community is locked
     * @param {string} communityAddress Community address
     * @returns {Promise<boolean>} Is the community locked
     * @throws {Error} "No connection"
     */
    const isCommunityLocked = async (communityAddress: string): Promise<boolean> => {
        if (!signer || !address) {
            throw new Error('No connection');
        }
        const locked = await communityContract(communityAddress, provider).locked();

        return locked;
    };

    return {
        addManager,
        getMaxBeneficiaries,
        isCommunityLocked,
        lockCommunity,
        removeManager,
        unlockCommunity,
        updateMaxBeneficiaries
    };
};
