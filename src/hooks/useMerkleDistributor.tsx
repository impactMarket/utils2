import React, { useEffect, useState } from 'react';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';
import { useContracts } from './useContracts';

export const useMerkleDistributor = (merkleTree: {
    claims: {
        [key: string]: {
            index: number;
            amount: string;
            proof: string[];
        };
    };
}) => {
    const { merkleDistributor: merkleDistributorContract } = useContracts();
    const { address, signer } = React.useContext(ImpactMarketContext);
    const [hasClaim, setHasClaim] = useState(false);

    const claim = async () => {
        try {
            if (!address || !merkleDistributorContract || !signer) {
                return;
            }

            const merkleDistributor = merkleDistributorContract.connect(signer);
            const treeAccount = merkleTree.claims[address];

            const tx = await merkleDistributor.claim(
                treeAccount.index,
                address,
                treeAccount.amount,
                treeAccount.proof
            );
            const response = await tx.wait();

            return response;
        } catch (error) {
            console.log('Error claim: \n', error);

            return { status: false };
        }
    };

    const verifyClaim = async () => {
        setHasClaim(true);
    };

    useEffect(() => {
        verifyClaim();
    }, [merkleDistributorContract, signer]);

    return { hasClaim, claim };
};
