import { ImpactProviderContext } from './ImpactProvider';
import { TransactionReceipt } from 'viem';
import { communityContract } from './community';
import { estimateBlockTime } from './estimateBlockTime';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import { updateCUSDBalance } from './useCUSDBalance';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Contract } from '@ethersproject/contracts';

export enum RequestFundsStatus {
    READY = 0,
    NOT_YET = 1,
    NOT_ENOUGH_FUNDS = 2
}

export type Beneficiary = {
    claimedAmount: number;
    locked: boolean;
    claimCooldown: number;
    community: {
        claimAmount: number;
        locked: boolean;
        maxClaim: number;
        balance: number;
        requestFundsStatus: number;
    };
    isFinished: boolean;
    isClaimable: boolean;
};

type UseBeneficiary = {
    beneficiary: Beneficiary & { contract?: Contract };
    claim: () => Promise<TransactionReceipt>;
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
    const { signer, provider, address, subgraph, networkId, connection } = React.useContext(ImpactProviderContext);
    const updateIntervalRef = useRef<NodeJS.Timer>();
    const syncClockInterval = 120000;

    const executeTransaction = internalUseTransaction();
    const [isReady, setIsReady] = useState(false);
    const [beneficiary, setBeneficiary] = useState<Beneficiary & { contract?: Contract }>({
        claimCooldown: 0,
        claimedAmount: 0,
        community: {
            balance: 0,
            claimAmount: 0,
            locked: false,
            maxClaim: 0,
            requestFundsStatus: RequestFundsStatus.NOT_YET
        },
        isClaimable: false,
        isFinished: false,
        locked: false
    });

    const startUpdateInterval = (claimCooldown: number, contract: Contract) => {
        const now = new Date().getTime() / 1000;

        // Cancel any existing interval
        if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
        }

        // Start a new interval
        if (now + syncClockInterval < claimCooldown) {
            updateIntervalRef.current = setInterval(async () => {
                if (contract && address) {
                    const cooldown = await contract.claimCooldown(address);
                    const currentBlockNumber = await provider.getBlockNumber();

                    if (cooldown.toNumber() > currentBlockNumber) {
                        const estimatedTime = estimateBlockTime(
                            currentBlockNumber,
                            cooldown.toNumber(),
                            5000
                        ).getTime();

                        if (estimatedTime !== claimCooldown) {
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
                updateClaimData(contract!);
            }, claimCooldown - new Date().getTime());
        }
    };

    const updateClaimData = async (_contract: Contract) => {
        if (!address) {
            return;
        }
        // eslint-disable-next-line prefer-const
        let { claimedAmount, locked, community } = beneficiary;
        const { cusd, treasury, communityAdmin } = getContracts(provider, networkId);
        let claimCooldown = 0;
        let isClaimable = false;
        const [
            cooldown,
            claimedAmounts,
            beneficiaryGraph,
            communityGraph,
            currentBlockNumber,
            treasuryMinBalance,
            treasuryBalance,
            communityBalance,
            lastFundRequest
        ] = await Promise.all([
            _contract.claimCooldown(address),
            _contract.beneficiaryClaimedAmounts(address),
            subgraph.getBeneficiaryData(address, '{ state }'),
            subgraph.getCommunityData(
                _contract.address,
                '{ baseInterval, claimAmount, maxClaim, beneficiaries, state }'
            ),
            provider.getBlockNumber(),
            communityAdmin.treasuryMinBalance(),
            cusd.balanceOf(treasury.address),
            cusd.balanceOf(_contract.address),
            _contract.lastFundRequest()
        ]);

        const getRequestFundsStatus = () => {
            if (parseInt(lastFundRequest, 10) + communityGraph.baseInterval! >= currentBlockNumber) {
                return RequestFundsStatus.NOT_YET;
            }
            if (toNumber(treasuryBalance) <= toNumber(treasuryMinBalance)) {
                return RequestFundsStatus.NOT_ENOUGH_FUNDS;
            }

            return RequestFundsStatus.READY;
        };

        claimedAmount = toNumber(claimedAmounts[0]);
        // if not beneficiary, prevent method from throwing error
        if (beneficiaryGraph) {
            if (community.maxClaim === 0) {
                locked = beneficiaryGraph.state === 2;
                community = {
                    ...community,
                    balance: toNumber(communityBalance),
                    claimAmount: parseFloat(communityGraph.claimAmount!),
                    locked: communityGraph.state === 2,
                    maxClaim: parseFloat(communityGraph.maxClaim!),
                    requestFundsStatus: getRequestFundsStatus()
                };
            } else {
                locked = beneficiaryGraph.state === 2;
                community = {
                    ...community,
                    balance: toNumber(communityBalance),
                    locked: communityGraph.state === 2,
                    requestFundsStatus: getRequestFundsStatus()
                };
            }
        }
        if (cooldown.toNumber() > currentBlockNumber) {
            claimCooldown = estimateBlockTime(currentBlockNumber, cooldown.toNumber(), 5000).getTime();
            isClaimable = false;

            // Start the interval
            startUpdateInterval(claimCooldown, _contract);
        } else {
            isClaimable = true;
        }
        setBeneficiary({
            claimCooldown,
            claimedAmount,
            community,
            contract: _contract,
            isClaimable,
            isFinished: claimedAmount === community.maxClaim,
            locked
        });
        setIsReady(true);
    };

    /**
     * Calls community claim method.
     *
     * @returns {TransactionReceipt} transaction response object
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
        const { contract, community } = beneficiary;

        if (!contract || (!signer && !connection) || !address) {
            throw new Error('No wallet connected');
        }
        if (community.balance < community.claimAmount && community.requestFundsStatus !== RequestFundsStatus.READY) {
            throw new Error("It's not possible to claim yet");
        }
        const tx = await contract.populateTransaction.claim();
        const response = await executeTransaction(tx);

        updateClaimData(contract);
        updateCUSDBalance(provider, networkId, address);

        return response;
    };

    /**
     * Refetch beneficiary cooldown data.
     * @throws {Error} "No address or contract"
     * @returns {Promise<void>} void
     */
    const refetch = useCallback(() => {
        const { contract } = beneficiary;

        if (!contract || !address) {
            throw new Error('No address or contract');
        }
        updateClaimData(contract);
    }, [isReady, address]);

    useEffect(() => {
        // make sure it's valid!
        if (address && provider && communityAddress) {
            const contract_ = communityContract(communityAddress, provider);

            updateClaimData(contract_);
        }
    }, [address]);

    return useMemo(() => ({ beneficiary, claim, isReady, refetch }), [isReady, beneficiary]);
};
