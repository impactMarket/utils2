import { ImpactProviderContext } from './ImpactProvider';
import { communityContract } from './community';
import React from 'react';

export const useManager = (communityAddress: string) => {
    const { signer } = React.useContext(ImpactProviderContext);

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
        if (!signer) {
            return;
        }
        const tx = await communityContract(communityAddress)
            .connect(signer)
            .addBeneficiary(beneficiaryAddress);
        const response = await tx.wait();

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
        if (!signer) {
            return;
        }
        const tx = await communityContract(communityAddress)
            .connect(signer)
            .removeBeneficiary(beneficiaryAddress);
        const response = await tx.wait();

        return response;
    };

    return { addBeneficiary, removeBeneficiary };
};
