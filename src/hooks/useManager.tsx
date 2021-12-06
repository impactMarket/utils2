import React, { useEffect, useState } from 'react';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';
import { communityContract } from '../utils/community';
import { Community } from '../types/contracts/Community';
import { Contract } from '@ethersproject/contracts';

export const useManager = (communityAddress: string) => {
    const [contract, setContract] = useState<(Contract & Community) | null>(
        null
    );
    const { signer } = React.useContext(ImpactMarketContext);

    const addBeneficiary = async (beneficiaryAddress: string) => {
        if (!contract || !signer) {
            return;
        }
        const tx = await (
            contract.connect(signer) as Contract & Community
        ).addBeneficiary(beneficiaryAddress);
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
        if (!contract || !signer) {
            return;
        }
        const tx = await (
            contract.connect(signer) as Contract & Community
        ).removeBeneficiary(beneficiaryAddress);
        const response = await tx.wait();

        return response;
    };

    useEffect(() => {
        if (communityAddress) {
            setContract(communityContract(communityAddress));
        }
    }, [communityAddress]);

    return { addBeneficiary, removeBeneficiary };
};
