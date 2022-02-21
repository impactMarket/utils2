import React from 'react';
import { ImpactProviderContext } from './ImpactProvider';
import { communityContract } from './community';

export const useManager = (communityAddress: string) => {
    const { signer } = React.useContext(ImpactProviderContext);

    /**
     * Add beneficiary to community
     * @param beneficiaryAddress Beneficiary address to be added
     * @returns `ethers.ContractReceipt`
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
     * @param beneficiaryAddress Beneficiary address to be removed
     * @returns `ethers.ContractReceipt`
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
