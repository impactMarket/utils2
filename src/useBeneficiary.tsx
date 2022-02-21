import React, { useEffect, useState } from 'react';
import { communityContract } from './community';
import type { Contract } from '@ethersproject/contracts';
import { estimateBlockTime } from './estimateBlockTime';
import { toNumber } from './toNumber';
import { ImpactProviderContext } from './ImpactProvider';
import { updateCUSDBalance } from './useCUSDBalance';

/**
 * useBeneficiary hook
 * @dev Hook for beneficiary UI
 */
export const useBeneficiary = (communityAddress: string) => {
    const [isReady, setIsReady] = useState(false);
    const [beneficiary, setBeneficiary] = useState<{
        claimedAmount: number;
    }>({
        claimedAmount: 0
    });
    const [claimCooldown, setClaimCooldown] = useState(new Date(0));
    const [contract, setContract] = useState<Contract | null>(null);
    const { provider, address, signer } = React.useContext(
        ImpactProviderContext
    );
    let refreshInterval: NodeJS.Timeout;

    const updateClaimData = async (_contract: Contract) => {
        if (!_contract || !address) {
            return;
        }
        const { claimedAmount } = await _contract.beneficiaries(address);
        setBeneficiary({
            claimedAmount: toNumber(claimedAmount)
        });
        setIsReady(true);
    };

    /**
     * Calls community claim method.
     * @returns {ethers.TransactionReceipt} transaction response object
     * @throws {Error} "LOCKED"
     * @throws {Error} "Community: NOT_VALID_BENEFICIARY"
     * @throws {Error} "Community::claim: NOT_YET"
     * @throws {Error} "Community::claim: MAX_CLAIM"
     * @throws {Error} "ERC20: transfer amount exceeds balance"
     * @throws {Error} "No contract or signer"
     */
    const claim = async () => {
        if (!contract || !signer || !address) {
            throw new Error('No contract or signer');
        }
        const tx = await (contract.connect(signer) as Contract).claim();
        const response = await tx.wait();

        updateClaimData(contract);
        updateCUSDBalance(provider, address);

        return response;
    };

    useEffect(() => {
        // Refresh beneficiary time for next claim
        const refreshClaimCooldown = async (
            _address: string,
            _contract: Contract
        ) => {
            const _cooldown = await _contract.claimCooldown(_address);
            const _currentBlockNumber = await provider.getBlockNumber();
            if (_cooldown.toNumber() > _currentBlockNumber) {
                const estimate = async () =>
                    estimateBlockTime(
                        _currentBlockNumber,
                        _cooldown.toNumber()
                    );
                refreshInterval = setInterval(async () => {
                    setClaimCooldown(await estimate());
                }, 10000);
                setClaimCooldown(await estimate());
            }
        };
        if (address && provider) {
            const contract_ = communityContract(communityAddress, provider);
            setContract(contract_);
            refreshClaimCooldown(address, contract_).then(() =>
                updateClaimData(contract_)
            );
        }
        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    return { claim, beneficiary, claimCooldown, isReady };
};
