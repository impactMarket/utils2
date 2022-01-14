import React, { useEffect, useState } from 'react';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';
import { communityContract } from '../utils/community';
import { BigNumber } from '@ethersproject/bignumber';
import { Community } from '../types/contracts/Community';
import { Contract } from '@ethersproject/contracts';
import { estimateBlockTime } from '../helpers/estimateBlockTime';
import { toNumber } from '../helpers/toNumber';

export const useBeneficiary = (communityAddress: string) => {
    const [isReady, setIsReady] = useState(false);
    const [isClaimable, setIsClaimable] = useState(false);
    const [beneficiary, setBeneficiary] = useState<{
        claimedAmount: number;
        lastClaim: BigNumber;
    }>({
        claimedAmount: 0,
        lastClaim: BigNumber.from(0)
    });
    const [claimCooldown, setClaimCooldown] = useState(new Date(0));
    const [contract, setContract] = useState<(Contract & Community) | null>(
        null
    );
    const { address, signer, provider } = React.useContext(ImpactMarketContext);
    let refreshInterval: NodeJS.Timeout;
    let timeoutInterval: NodeJS.Timeout;

    const updateClaimData = async (_contract: Contract & Community) => {
        if (!_contract || !address) {
            return;
        }
        const { claimedAmount, lastClaim } = await _contract.beneficiaries(
            address
        );
        setBeneficiary({
            claimedAmount: toNumber(claimedAmount),
            lastClaim
        });
        setIsReady(true);
    };

    /**
     * Beneficiary claim
     * @returns `ethers.ContractReceipt`
     * @throws {Error} "LOCKED"
     * @throws {Error} "Community: NOT_VALID_BENEFICIARY"
     * @throws {Error} "Community::claim: NOT_YET"
     * @throws {Error} "Community::claim: MAX_CLAIM"
     * @throws {Error} "ERC20: transfer amount exceeds balance"
     */
    const claim = async () => {
        if (!contract || !signer || !address) {
            return;
        }
        const tx = await (
            contract.connect(signer) as Contract & Community
        ).claim();
        const response = await tx.wait();

        updateClaimData(contract);
        const _cooldown = await contract.claimCooldown(address);
        const _currentBlockNumber = await provider.getBlockNumber();
        setClaimCooldown(
            estimateBlockTime(_currentBlockNumber, _cooldown.toNumber())
        );
        setIsClaimable(false);

        return response;
    };

    useEffect(() => {
        if (
            claimCooldown.getTime() !== new Date(0).getTime() &&
            timeoutInterval === undefined
        ) {
            const end = claimCooldown;
            const now = new Date();
            // 10 minutes
            if (end.getTime() - now.getTime() < 600000) {
                timeoutInterval = setTimeout(
                    () => setIsClaimable(true),
                    end.getTime() - now.getTime() - 1000
                );
            }
        }
        return () => {
            clearTimeout(timeoutInterval);
        };
    }, [claimCooldown]);

    useEffect(() => {
        // Refresh beneficiary time for next claim
        const refreshClaimCooldown = async (
            _address: string,
            _contract: Contract & Community
        ) => {
            const _cooldown = await _contract.claimCooldown(_address);
            const _currentBlockNumber = await provider.getBlockNumber();
            if (_cooldown.toNumber() > _currentBlockNumber) {
                const estimate = async () =>
                    estimateBlockTime(
                        await provider.getBlockNumber(),
                        _cooldown.toNumber()
                    );
                refreshInterval = setInterval(
                    () => estimate().then(setClaimCooldown),
                    300000 // 5 minutes
                );
                setClaimCooldown(await estimate());
            } else {
                setIsClaimable(true);
            }
        };
        if (address && provider) {
            const contract_ = communityContract(communityAddress, provider);
            setContract(contract_);
            refreshClaimCooldown(address, contract_).then(() =>
                updateClaimData(contract_)
            );
        }
        return () => clearInterval(refreshInterval);
    }, []);

    return { claim, beneficiary, claimCooldown, isClaimable, isReady };
};
