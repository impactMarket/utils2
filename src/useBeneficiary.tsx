import { ImpactProviderContext } from './ImpactProvider';
import { communityContract } from './community';
import { estimateBlockTime } from './estimateBlockTime';
import { estimateRemainingFundsInDays } from './estimateRemainingFundsInDays';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { updateCUSDBalance } from './useCUSDBalance';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { Contract } from '@ethersproject/contracts';

// prevent re-render when loading
const useBlockNumber = () => {
    const [blockNumber, setBlockNumber] = useState(0);
    // TODO: during mobile app development, we need to use the provider instead of connection
    const { provider } = React.useContext(ImpactProviderContext);

    useEffect(() => {
        const updateBlockNumber = async () => {
            const blockNumber = await provider.getBlockNumber();

            setBlockNumber(blockNumber);
        };

        updateBlockNumber();
    }, [provider]);

    return blockNumber;
};

/**
 * useBeneficiary hook
 * @dev Hook for beneficiary UI
 * @param {string} communityAddress Address of the community contract
 * @returns {object} hook
 */
export const useBeneficiary = (communityAddress: string) => {
    const { connection, provider, address, subgraph, networkId } = React.useContext(ImpactProviderContext);
    const currentBlockNumber = useBlockNumber();
    console.log({ currentBlockNumber});
    const executeTransaction = internalUseTransaction();
    const [isReady, setIsReady] = useState(false);
    const [beneficiary, setBeneficiary] = useState<{
        claimedAmount: number;
        locked: boolean;
        claimCooldown: number;
        community: {
            claimAmount: number;
            hasFunds: boolean;
            locked: boolean;
            maxClaim: number;
        };
        contract: Contract | null;
        fundsRemainingDays: number;
        isClaimable: boolean;
    }>({
        claimCooldown: 0,
        claimedAmount: 0,
        community: {
            claimAmount: 0,
            hasFunds: false,
            locked: false,
            maxClaim: 0
        },
        contract: null,
        fundsRemainingDays: 0,
        isClaimable: false,
        locked: false
    });

    const updateClaimData = async (_contract: Contract) => {
        if (!address) {
            return;
        }
        // eslint-disable-next-line prefer-const
        let { claimedAmount, locked, community, claimCooldown, isClaimable } = beneficiary;
        const { cusd } = getContracts(provider, networkId);
        const [communityBalance, cooldown, beneficiaryGraph, communityGraph] = await Promise.all([
            cusd.balanceOf(_contract.address),
            _contract.claimCooldown(address),
            subgraph.getBeneficiaryData(address, '{ claimed, state }'),
            subgraph.getCommunityData(
                _contract.address,
                '{ baseInterval, claimAmount, maxClaim, beneficiaries, state }'
            )
        ]);

        // if not beneficiary, prevent method from throwing error
        if (beneficiaryGraph === null) {
            // do nothing
        } else if (community.maxClaim === 0) {
            claimedAmount = parseInt(beneficiaryGraph.claimed!, 10);
            locked = beneficiaryGraph.state === 2;
            community = {
                ...community,
                claimAmount: parseFloat(communityGraph.claimAmount!),
                hasFunds: toNumber(communityBalance) > parseFloat(communityGraph.claimAmount!),
                locked: communityGraph.state === 2,
                maxClaim: parseFloat(communityGraph.maxClaim!)
            };
        } else {
            claimedAmount = parseInt(beneficiaryGraph.claimed!, 10);
            locked = beneficiaryGraph.state === 2;
            community = {
                ...community,
                hasFunds: toNumber(communityBalance) > parseFloat(communityGraph.claimAmount!),
                locked: communityGraph.state === 2
            };
        }
        if (cooldown.toNumber() > currentBlockNumber) {
            claimCooldown = estimateBlockTime(currentBlockNumber, cooldown.toNumber(), 5000).getTime();
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
        console.log('reload inside');
        // make sure it's valid!
        if (address && connection && provider && communityAddress && currentBlockNumber !== 0) {
            const contract_ = communityContract(communityAddress, provider);


            updateClaimData(contract_);
        }
    }, [currentBlockNumber]);

    return useMemo(() => ({ beneficiary, claim, isReady, refetch }), [isReady, beneficiary.isClaimable]);
};
