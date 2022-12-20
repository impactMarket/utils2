import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import React from 'react';

export const useLearnAndEarch = () => {
    const { provider, address, connection, networkId } = React.useContext(ImpactProviderContext);
    const executeTransaction = internalUseTransaction();

    /**
     * Claims airgrab rewards.
     * @param {string} beneficiary Beneficiary to receive rewards
     * @param {number[]} levelIds Level IDs to claim rewards for
     * @param {number[]} rewardAmounts Amounts to claim
     * @param {string[]} signatures Signatures for each level
     * @returns {ethers.ContractReceipt} tx response object
     */
    const claimRewardForLevels = async (
        beneficiary: string,
        levelIds: number[],
        rewardAmounts: number[],
        signatures: string[]
    ) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { learnAndEarn } = getContracts(provider, networkId);
        const tx = await learnAndEarn.populateTransaction.claimRewardForLevels(
            beneficiary,
            levelIds,
            rewardAmounts,
            signatures
        );
        const response = await executeTransaction(tx);

        return response;
    };

    return { claimRewardForLevels };
};
