import { ImpactProviderContext } from './ImpactProvider';
import { communityContract } from './community';
import { executeTransaction } from './executeTransaction';
import { getContracts } from './contracts';
import React from 'react';

export const useManager = (communityAddress: string) => {
    const { connection, address, provider } = React.useContext(ImpactProviderContext);

    /**
     * Add beneficiary to community
     * @param {string} beneficiaryAddress Beneficiary address to be added
     * @returns {ethers.ContractReceipt} transaction response object
     * @throws {Error} "Community: NOT_MANAGER"
     * @example
     * ```typescript
     * const { addBeneficiary } = useManager('community-address');
     * const tx = await addBeneficiary('beneficiary-address');
     * ```
     */
    const addBeneficiary = async (beneficiaryAddress: string) => {
        if (!connection || !address) {
            return;
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.addBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Remove beneficiary from community
     * @param {string} beneficiaryAddress Beneficiary address to be removed
     * @returns {ethers.ContractReceipt} transaction response object
     * @throws {Error} "Community: NOT_MANAGER"
     * @throws {Error} "Community::removeBeneficiary: NOT_YET"
     */
    const removeBeneficiary = async (beneficiaryAddress: string) => {
        if (!connection || !address) {
            return;
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.removeBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    return { addBeneficiary, removeBeneficiary };
};
