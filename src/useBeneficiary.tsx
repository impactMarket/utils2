import { ImpactProviderContext } from './ImpactProvider';
import { communityContract } from './community';
import { estimateBlockTime } from './estimateBlockTime';
import { executeTransaction } from './executeTransaction';
import { getContracts } from './contracts';
import { toNumber } from './toNumber';
import { updateCUSDBalance } from './useCUSDBalance';
import React, { useEffect, useState } from 'react';
import type { Contract } from '@ethersproject/contracts';

const refreshIntervalInMs = 300000;

/**
 * useBeneficiary hook
 * @dev Hook for beneficiary UI
 * @param {string} communityAddress Address of the community contract
 * @returns {object} hook
 */
export const useBeneficiary = (communityAddress: string) => {
    const [isReady, setIsReady] = useState(false);
    const [isClaimable, setIsClaimable] = useState(false);
    const [beneficiary, setBeneficiary] = useState<{
        claimedAmount: number;
    }>({
        claimedAmount: 0
    });
    const [community, setCommunity] = useState<{
        claimAmount: number;
        hasFunds: boolean;
        maxClaim: number;
    }>({
        claimAmount: 0,
        hasFunds: false,
        maxClaim: 0,
    });
    const [claimCooldown, setClaimCooldown] = useState(0);
    const [contract, setContract] = useState<Contract | null>(null);
    const { connection, provider, address } = React.useContext(ImpactProviderContext);
    let refreshInterval: NodeJS.Timeout;
    let timeoutInterval: NodeJS.Timeout;

    const updateClaimData = async (_contract: Contract) => {
        if (!_contract || !address) {
            return;
        }
        const { claimedAmount } = await _contract.beneficiaries(address);
        const { cusd } = await getContracts(provider);
        const communityBalance = await cusd.balanceOf(_contract.address);

        if (community.maxClaim === 0) {
            const maxClaim = await _contract.maxClaim();
            const claimAmount = await _contract.claimAmount();

            setBeneficiary(b => ({
                ...b,
                claimedAmount: toNumber(claimedAmount)
            }));
            setCommunity(c => ({
                ...c,
                claimAmount: toNumber(claimAmount),
                hasFunds: toNumber(communityBalance) > toNumber(claimAmount),
                maxClaim: toNumber(maxClaim)
            }));
        } else {
            setBeneficiary(b => ({
                ...b,
                claimedAmount: toNumber(claimedAmount)
            }));
            setCommunity(c => ({
                ...c,
                communityBalance: toNumber(communityBalance)
            }));
        }
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
        if (!contract || !connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await contract.populateTransaction.claim();
        const response = await executeTransaction(connection, address, cusd.address, tx);

        updateClaimData(contract);
        updateCUSDBalance(provider, address);
        const _cooldown = await contract.claimCooldown(address);
        let _currentBlockNumber = await provider.getBlockNumber();
        const estimate = async () => {
            _currentBlockNumber = await provider.getBlockNumber();

            return estimateBlockTime(_currentBlockNumber, _cooldown.toNumber());
        };

        setClaimCooldown((await estimate()).getTime());
        setIsClaimable(false);

        return response;
    };

    // two intervals are needed
    // one to refresh the end date (updating according to remaining blocks)
    // and the other to countdown until end date and refresh the claimable status

    useEffect(() => {
        if (claimCooldown !== 0 && timeoutInterval === undefined) {
            const end = claimCooldown;
            const now = new Date().getTime();

            if (end > now && end - now < refreshIntervalInMs) {
                timeoutInterval = setTimeout(() => {
                    setIsClaimable(true);
                    if (timeoutInterval) {
                        clearTimeout(timeoutInterval);
                    }
                    if (refreshInterval) {
                        clearInterval(refreshInterval);
                    }
                }, end - now - 1000);
            }
        }

        return () => {
            clearTimeout(timeoutInterval);
        };
    }, [claimCooldown]);

    useEffect(() => {
        // Refresh beneficiary time for next claim
        const refreshClaimCooldown = async (_address: string, _contract: Contract) => {
            const _cooldown = await _contract.claimCooldown(_address);
            let _currentBlockNumber = await provider.getBlockNumber();

            if (_cooldown.toNumber() > _currentBlockNumber) {
                const estimate = async () => {
                    _currentBlockNumber = await provider.getBlockNumber();

                    return _cooldown.toNumber() > _currentBlockNumber
                        ? estimateBlockTime(_currentBlockNumber, _cooldown.toNumber())
                        : new Date(0);
                };

                if (refreshInterval) {
                    clearInterval(refreshInterval);
                }
                refreshInterval = setInterval(() => {
                    estimate().then(d => {
                        if (d.getTime() === 0 && refreshInterval) {
                            clearInterval(refreshInterval);
                        } else {
                            setClaimCooldown(d.getTime());
                        }
                    });
                }, refreshIntervalInMs);
                setClaimCooldown((await estimate()).getTime());
            } else {
                setIsClaimable(true);
            }
        };

        // make sure it's valid!
        if (address && connection && provider && communityAddress) {
            const contract_ = communityContract(communityAddress, provider);

            setContract(contract_);
            refreshClaimCooldown(address, contract_).then(() => updateClaimData(contract_));
        }

        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    return { beneficiary, claim, claimCooldown, community, isClaimable, isReady };
};
