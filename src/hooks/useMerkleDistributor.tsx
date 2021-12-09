import React, { useEffect, useState } from 'react';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';
import { useContracts } from './useContracts';

export const useMerkleDistributor = () => {
    const { merkleDistributor: merkleDistributorContract } = useContracts();
    const { address, signer } = React.useContext(ImpactMarketContext);
    const [hasClaim, setHasClaim] = useState(false);

    const claim = async () => {
        try {
            if (!address || !merkleDistributorContract || !signer) {
                return;
            }

            const merkleDistributor = merkleDistributorContract.connect(signer);

            const tx = await merkleDistributor.claim(
                0,
                address,
                '100',
                'proof0'
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
