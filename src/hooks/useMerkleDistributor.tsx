import { BigNumber } from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { toNumber } from '../helpers/toNumber';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';
import { getContracts } from '../utils/contracts';

export const useMerkleDistributor = (treeAccount: {
    index: number;
    amount: string;
    proof: string[];
}) => {
    const { address, signer, provider } = React.useContext(ImpactMarketContext);
    const [hasClaim, setHasClaim] = useState(false);
    const [amountToClaim, setAmountToClaim] = useState(0);

    const claim = async () => {
        try {
            const { merkleDistributor } = await getContracts(provider);
            if (!address || !signer) {
                return;
            }

            const tx = await merkleDistributor
                .connect(signer)
                .claim(
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
            const { merkleDistributor } = await getContracts(provider);
            if (!address || !signer) {
                return;
            }

            if (treeAccount) {
                const _isClaimed = await merkleDistributor.isClaimed(
                    treeAccount.index
                );
                setAmountToClaim(
                    toNumber(new BigNumber(treeAccount.amount, 16).toString())
                );
                setHasClaim(!_isClaimed);
            }
        };
        verifyClaim();
    }, [address]);

    return { hasClaim, amountToClaim, claim };
};
