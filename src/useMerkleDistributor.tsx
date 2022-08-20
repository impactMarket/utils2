import { BigNumber } from 'bignumber.js';
import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { updatePACTBalance } from './usePACTBalance';
import React, { useEffect, useState } from 'react';

export const useMerkleDistributor = (treeAccount: { index: number; amount: string; proof: string[] }) => {
    const { provider, address, connection } = React.useContext(ImpactProviderContext);
    const [hasClaim, setHasClaim] = useState(false);
    const [amountToClaim, setAmountToClaim] = useState(0);
    const executeTransaction = internalUseTransaction();

    /**
     * Claims airgrab rewards.
     * @returns {ethers.ContractReceipt} tx response object
     */
    const claim = async () => {
        try {
            const { merkleDistributor } = await getContracts(provider);

            if (!address || !connection) {
                return;
            }

            const tx = await merkleDistributor.populateTransaction.claim(
                treeAccount.index,
                address,
                treeAccount.amount,
                treeAccount.proof
            );
            const response = await executeTransaction(tx);

            updatePACTBalance(provider, address);

            return response;
        } catch (error) {
            console.log('Error claim: \n', error);

            return { status: false };
        }
    };

    useEffect(() => {
        const verifyClaim = async () => {
            const { merkleDistributor } = await getContracts(provider);

            if (!address || !connection) {
                return;
            }

            if (treeAccount) {
                const _isClaimed = await merkleDistributor.isClaimed(treeAccount.index);

                setAmountToClaim(toNumber(new BigNumber(treeAccount.amount, 16).toString()));
                setHasClaim(!_isClaimed);
            }
        };

        verifyClaim();
    }, [address]);

    return { amountToClaim, claim, hasClaim };
};
