import { ImpactProviderContext } from './ImpactProvider';
import { communityContract } from './community';
import { executeTransaction } from './executeTransaction';
import { getContracts } from './contracts';
import React from 'react';
import type { CeloTxReceipt } from '@celo/connect';

export const useManager = (communityAddress: string) => {
    const { connection, address, provider } = React.useContext(ImpactProviderContext);

    /**
     * Add beneficiary to community
     * @param {string} beneficiaryAddress Beneficiary address to be added
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "Community: NOT_MANAGER"
     * @example
     * ```typescript
     * const { addBeneficiary } = useManager('community-address');
     * const tx = await addBeneficiary('beneficiary-address');
     * ```
     */
    const addBeneficiary = async (beneficiaryAddress: string): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.addBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Remove beneficiary from community
     * @param {string} beneficiaryAddress Beneficiary address to be removed
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "Community: NOT_MANAGER"
     * @throws {Error} "Community::removeBeneficiary: NOT_YET"
     * @example
     * ```typescript
     * const { removeBeneficiary } = useManager('community-address');
     * const tx = await removeBeneficiary('beneficiary-address');
     * ```
     */
    const removeBeneficiary = async (beneficiaryAddress: string): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.removeBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Lock beneficiary in community
     * @param {string} beneficiaryAddress Beneficiary address to be locked
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "Community: NOT_MANAGER"
     * @throws {Error} "Community::lockBeneficiary: NOT_YET"
     * @example
     * ```typescript
     * const { lockBeneficiary } = useManager('community-address');
     * const tx = await lockBeneficiary('beneficiary-address');
     * ```
     */
    const lockBeneficiary = async (beneficiaryAddress: string): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.lockBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Unlock beneficiary in community
     * @param {string} beneficiaryAddress Beneficiary address to be unlocked
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "Community: NOT_MANAGER"
     * @throws {Error} "Community::unlockBeneficiary: NOT_YET"
     * @example
     * ```typescript
     * const { unlockBeneficiary } = useManager('community-address');
     * const tx = await unlockBeneficiary('beneficiary-address');
     * ```
     */
    const unlockBeneficiary = async (beneficiaryAddress: string): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.unlockBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Allow manager to request funds from the DAO treasury
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "CommunityAdmin::fundCommunity: Not enough funds"
     * @throws {Error} "ERC20: transfer amount exceeds balance"
     * @throws {Error} "Community: NOT_MANAGER"
     * @example
     * ```typescript
     * const { requestFunds } = useManager('community-address');
     * const tx = await requestFunds();
     * ```
     */
    const requestFunds = async (): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.requestFunds();
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    return {
        addBeneficiary,
        lockBeneficiary,
        removeBeneficiary,
        requestFunds,
        unlockBeneficiary
    };
};
