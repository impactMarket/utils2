import { Contract } from '@ethersproject/contracts';
import { ImpactProviderContext, PACTBalanceContext } from './ImpactProvider';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { updatePACTBalance } from './usePACTBalance';
import AirdropRecurringABI from './abi/AirdropRecurringABI.json';
import React, { useEffect, useRef, useState } from 'react';
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
    const { provider, address, signer, networkId } = React.useContext(ImpactProviderContext);
    const { setBalance: setPACTBalance } = React.useContext(PACTBalanceContext);
    const [amountClaimed, setAmountClaimed] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [trancheAmount, setTrancheAmount] = useState(0);
    const [nextClaim, setNextClaim] = useState(new Date(0));
    const [isReady, setIsReady] = useState(false);
    const airdropper = new Contract(airdropSmartContractAddress, AirdropRecurringABI, provider) as AirdropRecurring;
    const executeTransaction = internalUseTransaction();
    const updateIntervalRef = useRef<NodeJS.Timer>();
    const clockInterval = 120000;

    // update claim data at the end of the cooldown
    const _startUpdateInterval = (userAddress: string, lastClaimTime: number, cooldown: number) => {
        const now = new Date().getTime() / 1000;
        const end = lastClaimTime + cooldown;

        // Cancel any existing interval
        if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
        }

        // Start a new interval
        if (now + clockInterval < end) {
            updateIntervalRef.current = setInterval(() => {
                if (now + clockInterval >= end) {
                    clearInterval(updateIntervalRef.current);
                    updateIntervalRef.current = setTimeout(() => {
                        _reloadingClaimStatus(userAddress);
                    }, end - now + 1000);
                }
            }, clockInterval);
        } else {
            updateIntervalRef.current = setTimeout(() => {
                _reloadingClaimStatus(userAddress);
            }, end - now + 1000);
        }
    };

    /**
     * Claims airgrab rewards.
     * @param {string} proofs Airdrop merkle tree claim proofs
     * @returns {ethers.ContractReceipt} tx response object
     */
    const claim = async (proofs: string[]) => {
        if (!address || !signer) {
            throw new Error('No wallet connected');
        }

        const tx = await airdropper.populateTransaction.claim(address, proofs);
        const response = await executeTransaction(tx);

        // reload state
        setIsReady(false);
        Promise.all([updatePACTBalance(provider, networkId, address), _reloadingClaimStatus(address)])
            .then(([newBalance]) => setPACTBalance(newBalance))
            .finally(() => setIsReady(true));

        return response;
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
        if (lastClaimTime.toNumber() !== 0) {
            setNextClaim(new Date((lastClaimTime.toNumber() + cooldown.toNumber()) * 1000));
            _startUpdateInterval(address, lastClaimTime.toNumber(), cooldown.toNumber());
        } else {
            setNextClaim(new Date(0));
        }
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
            setIsReady(true);
        };

        load();
    }, [address]);

    return { amountClaimed, claim, isReady, nextClaim, totalAmount, trancheAmount };
};
