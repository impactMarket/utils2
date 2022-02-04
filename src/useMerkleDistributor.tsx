import { BigNumber } from 'bignumber.js';
import { useEffect, useState } from 'react';
import { toNumber } from './toNumber';
import { getContracts } from './contracts';
import { Signer } from '@ethersproject/abstract-signer';
import { BaseProvider } from '@ethersproject/providers';

export const useMerkleDistributor = (props: {
    treeAccount: {
        index: number;
        amount: string;
        proof: string[];
    };
    address: string;
    signer: Signer | null;
    provider: BaseProvider;
}) => {
    const { treeAccount, address, signer, provider } = props;
    const [hasClaim, setHasClaim] = useState(false);
    const [amountToClaim, setAmountToClaim] = useState(0);

    /**
     * Claims airgrab (should update balance once finished)
     * @returns
     */
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
