import { ImpactProviderContext } from './ImpactProvider';
import { communityContract } from './community';
import { estimateBlockTime } from './estimateBlockTime';
import { estimateRemainingFundsInDays } from './estimateRemainingFundsInDays';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { updateCUSDBalance } from './useCUSDBalance';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CeloTxReceipt } from '@celo/connect';
import type { Contract } from '@ethersproject/contracts';

export type Beneficiary = {
    claimedAmount: number;
    locked: boolean;
    claimCooldown: number;
    community: {
        claimAmount: number;
        hasFunds: boolean;
        locked: boolean;
        maxClaim: number;
    };
    fundsRemainingDays: number;
    isClaimable: boolean;
};

type UseBeneficiary = {
    beneficiary: Beneficiary & { contract?: Contract };
    claim: () => Promise<CeloTxReceipt>;
    isReady: boolean;
    refetch: () => void;
};

/**
 * useBeneficiary hook
 * @dev Hook for beneficiary UI
 * @param {string} communityAddress Address of the community contract
 * @returns {UseBeneficiary} hook
 */
export const useBeneficiary = (communityAddress: string): UseBeneficiary => {
    const { connection, provider, address, subgraph, networkId } = React.useContext(ImpactProviderContext);
    const updateIntervalRef = useRef<NodeJS.Timer>();
    const syncClockInterval = 300000;

    const executeTransaction = internalUseTransaction();
    const [isReady, setIsReady] = useState(false);
    const [beneficiary, setBeneficiary] = useState<Beneficiary & { contract?: Contract }>({
        claimCooldown: 0,
        claimedAmount: 0,
        community: {
            claimAmount: 0,
            hasFunds: false,
            locked: false,
            maxClaim: 0
        },
        fundsRemainingDays: 0,
        isClaimable: false,
        locked: false
    });

    const startUpdateInterval = (timeout: number) => {
        const now = new Date().getTime() / 1000;

        // Cancel any existing interval
        if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
        }

        // Start a new interval
        if (now + syncClockInterval < timeout) {
            updateIntervalRef.current = setInterval(async () => {
                if (beneficiary.contract && address && isReady) {
                    const { claimCooldown, contract } = beneficiary;
                    const cooldown = contract.claimCooldown(address);
                    const currentBlockNumber = await provider.getBlockNumber();
    
                    if (cooldown.toNumber() > currentBlockNumber) {
                        const estimatedTime = estimateBlockTime(currentBlockNumber, cooldown.toNumber(), 5000).getTime();

                        if (now + syncClockInterval > estimatedTime) {
                            startUpdateInterval(estimatedTime);
                        } else if (estimatedTime !== claimCooldown) {
                            setBeneficiary(b => ({
                                ...b,
                                claimCooldown: estimatedTime
                            }));
                        }
                    } else if (updateIntervalRef.current) {
                        clearInterval(updateIntervalRef.current);
                        updateClaimData(contract);
                    }
                }
            }, syncClockInterval);
        } else {
            updateIntervalRef.current = setTimeout(() => {
                const { contract } = beneficiary;
                
                updateClaimData(contract!);
            }, timeout);
        }
    };

    const updateClaimData = async (_contract: Contract) => {
        if (!address) {
            return;
        }
        // eslint-disable-next-line prefer-const
        let { claimedAmount, locked, community, claimCooldown, isClaimable } = beneficiary;
        const { cusd } = getContracts(provider, networkId);
        const [communityBalance, cooldown, beneficiaryGraph, communityGraph, currentBlockNumber] = await Promise.all([
            cusd.balanceOf(_contract.address),
            _contract.claimCooldown(address),
            subgraph.getBeneficiaryData(address, '{ claimed, state }'),
            subgraph.getCommunityData(
                _contract.address,
                '{ baseInterval, claimAmount, maxClaim, beneficiaries, state }'
            ),
            provider.getBlockNumber()
        ]);

        // if not beneficiary, prevent method from throwing error
        if (beneficiaryGraph) {
            if (community.maxClaim === 0) {
                claimedAmount = parseFloat(beneficiaryGraph.claimed!);
                locked = beneficiaryGraph.state === 2;
                community = {
                    ...community,
                    claimAmount: parseFloat(communityGraph.claimAmount!),
                    hasFunds: toNumber(communityBalance) > parseFloat(communityGraph.claimAmount!),
                    locked: communityGraph.state === 2,
                    maxClaim: parseFloat(communityGraph.maxClaim!)
                };
            } else {
                claimedAmount = parseFloat(beneficiaryGraph.claimed!);
                locked = beneficiaryGraph.state === 2;
                community = {
                    ...community,
                    hasFunds: toNumber(communityBalance) > parseFloat(communityGraph.claimAmount!),
                    locked: communityGraph.state === 2
                };
            }
        }
        if (cooldown.toNumber() > currentBlockNumber) {
            claimCooldown = estimateBlockTime(currentBlockNumber, cooldown.toNumber(), 5000).getTime();
            isClaimable = false;

            // Start the interval
            startUpdateInterval(claimCooldown);
        } else {
            isClaimable = true;
        }
        setBeneficiary({
            claimCooldown,
            claimedAmount,
            community,
            contract: _contract,
            fundsRemainingDays: estimateRemainingFundsInDays({
                baseInterval: communityGraph.baseInterval!,
                beneficiaries: communityGraph.beneficiaries!,
                claimAmount: parseFloat(communityGraph.claimAmount!),
                fundsOnContract: toNumber(communityBalance)
            }),
            isClaimable,
            locked
        });
        setIsReady(true);
    };

    /**
     * Calls community claim method.
     *
     * @returns {ethers.TransactionReceipt} transaction response object
     * @throws {Error} "LOCKED"
     * @throws {Error} "Community: NOT_VALID_BENEFICIARY"
     * @throws {Error} "Community::claim: NOT_YET"
     * @throws {Error} "Community::claim: MAX_CLAIM"
     * @throws {Error} "ERC20: transfer amount exceeds balance"
     * @throws {Error} "No connection"
     *
     * @example
     * ```typescript
     * const { claim } = useBeneficiary('community-address');
     * const tx = await claim();
     * ```
     */
    const claim = async () => {
        const { contract } = beneficiary;

        if (!contract || !connection || !address) {
            throw new Error('No connection');
        }
        const tx = await contract.populateTransaction.claim();
        const response = await executeTransaction(tx);

        updateClaimData(contract);
        updateCUSDBalance(provider, networkId, address);

        return response;
    };

    /**
     * Refetch beneficiary cooldown data.
     * @throws {Error} "No connection"
     * @returns {Promise<void>} void
     */
    const refetch = useCallback(() => {
        const { contract } = beneficiary;

        if (!contract || !connection || !address) {
            throw new Error('No connection');
        }
        updateClaimData(contract);
    }, [isReady]);

    useEffect(() => {
        // make sure it's valid!
        if (address && connection && provider && communityAddress) {
            const contract_ = communityContract(communityAddress, provider);

            updateClaimData(contract_);
        }
    }, []);

    return useMemo(() => ({ beneficiary, claim, isReady, refetch }), [isReady, beneficiary.claimCooldown]);
};
