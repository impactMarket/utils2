import { BigNumber } from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { toNumber } from '../helpers/toNumber';
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
    const [amountToClaim, setAmountToClaim] = useState(0);

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

    useEffect(() => {
        const verifyClaim = async () => {
            if (!address || !merkleDistributorContract || !signer) {
                return;
            }

            const treeAccount = merkleTree.claims[address];
            if (treeAccount) {
                const _isClaimed = await merkleDistributorContract.isClaimed(
                    treeAccount.index
                );
                setAmountToClaim(
                    toNumber(new BigNumber(treeAccount.amount, 16).toString())
                );
                setHasClaim(!_isClaimed);
            }
        };
        verifyClaim();
    }, [merkleDistributorContract, signer]);

    return { hasClaim, amountToClaim, claim };
};
