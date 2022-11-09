import { Contract } from '@ethersproject/contracts';
import { ImpactProviderContext } from './ImpactProvider';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { updatePACTBalance } from './usePACTBalance';
import AirdropRecurringABI from './abi/AirdropRecurringABI.json';
import React, { useEffect, useState } from 'react';
import type { BigNumber } from 'bignumber.js';

/**
 * Smart contract interface
 */
export interface AirdropRecurring extends Contract {
    beneficiaries(address: string): Promise<{ claimedAmount: BigNumber; lastClaimTime: BigNumber }>;
    cooldown(): Promise<BigNumber>;
}

/**
 * @param {string} airdropSmartContractAddress Airdrop smart contract address
 * @returns {any} Claim function and details
 */
export const useAirdropRecurring = (airdropSmartContractAddress: string) => {
    const { provider, address, connection } = React.useContext(ImpactProviderContext);
    const [amountClaimed, setAmountClaimed] = useState(0);
    const [nextClaim, setNextClaim] = useState(new Date());
    const [isReady, setIsReady] = useState(false);
    const airdropper = new Contract(airdropSmartContractAddress, AirdropRecurringABI, provider) as AirdropRecurring;
    const executeTransaction = internalUseTransaction();

    /**
     * Claims airgrab rewards.
     * @param {string} proofs Airdrop merkle tree claim proofs
     * @returns {ethers.ContractReceipt} tx response object
     */
    const claim = async (proofs: string[]) => {
        try {
            if (!address || !connection) {
                return;
            }

            const tx = await airdropper.populateTransaction.claim(address, proofs);
            const response = await executeTransaction(tx);

            // reload state
            setIsReady(false);
            updatePACTBalance(provider, address);
            _reloadingClaimStatus(address).then(() => setIsReady(true));

            return response;
        } catch (error) {
            console.log('Error claim: \n', error);

            return { status: false };
        }
    };

    /**
     * Private method to reload user claim status
     * @param {string} address user address
     * @return {Promise<void>} no return
     */
    const _reloadingClaimStatus = async (address: string) => {
        const [{ claimedAmount, lastClaimTime }, cooldown] = await Promise.all([
            airdropper.beneficiaries(address),
            airdropper.cooldown()
        ]);

        setAmountClaimed(toNumber(claimedAmount));
        setNextClaim(new Date((lastClaimTime.toNumber() + cooldown.toNumber()) * 1000));
    };

    useEffect(() => {
        const load = () => {
            if (!address) {
                return;
            }
            _reloadingClaimStatus(address).then(() => setIsReady(true));
        };

        load();
    }, [address]);

    return { amountClaimed, claim, isReady, nextClaim };
};
