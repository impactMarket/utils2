import { Contract } from '@ethersproject/contracts';
import { ImpactProviderContext, PACTBalanceContext } from './ImpactProvider';
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
    totalAmount(): Promise<BigNumber>;
    trancheAmount(): Promise<BigNumber>;
}

/**
 * @param {string} airdropSmartContractAddress Airdrop smart contract address
 * @returns {any} Claim function and details
 */
export const useAirdropRecurring = (airdropSmartContractAddress: string) => {
    const { provider, address, connection, networkId } = React.useContext(ImpactProviderContext);
    const { setBalance: setPACTBalance } = React.useContext(PACTBalanceContext);
    const [amountClaimed, setAmountClaimed] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [trancheAmount, setTrancheAmount] = useState(0);
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
            updatePACTBalance(provider, networkId, address).then(setPACTBalance);
            _reloadingClaimStatus(address);

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
        const load = async () => {
            if (!address) {
                return;
            }
            const [, total, tranche] = await Promise.all([
                _reloadingClaimStatus(address),
                airdropper.totalAmount(),
                airdropper.trancheAmount()
            ]);

            setTotalAmount(toNumber(total));
            setTrancheAmount(toNumber(tranche));
            setIsReady(true)
        };

        load();
    }, [address]);

    return { amountClaimed, claim, isReady, nextClaim, totalAmount, trancheAmount };
};
