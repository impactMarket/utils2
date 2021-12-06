import React, { useEffect, useState } from 'react';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';
import { communityContract } from '../utils/community';
import { BigNumber } from '@ethersproject/bignumber';
import { Community } from '../types/contracts/Community';
import { Contract } from '@ethersproject/contracts';
import { estimateBlockTime } from '../helpers/estimateBlockTime';

export const useBeneficiary = (communityAddress: string) => {
    const [beneficiary, setBeneficiary] = useState<{
        claimedAmount: BigNumber;
        lastClaim: BigNumber;
    }>({
        claimedAmount: BigNumber.from(0),
        lastClaim: BigNumber.from(0)
    });
    /**
     * Use with `refreshClaimCooldown`
     */
    const [claimCooldown, setClaimCooldown] = useState(new Date());
    const [contract, setContract] = useState<(Contract & Community) | null>(
        null
    );
    const { address, signer, provider } = React.useContext(ImpactMarketContext);
    let refreshInterval: NodeJS.Timeout;

    const updateClaimData = async () => {
        if (!contract || !address) {
            return;
        }
        const { claimedAmount, lastClaim } = await contract.beneficiaries(
            address
        );
        setBeneficiary({
            claimedAmount,
            lastClaim
        });
        localStorage.setItem(
            `@beneficiary/claim-${communityAddress}`,
            JSON.stringify({
                claimedAmount: claimedAmount.toString(),
                lastClaim: lastClaim.toString()
            })
        );
    };

    /**
     * Refresh beneficiary time for next claim
     */
    const refreshClaimCooldown = async () => {
        if (!contract || !address) {
            return;
        }
        const _cooldown = await contract.claimCooldown(address);
        refreshInterval = setInterval(async () => {
            setClaimCooldown(
                estimateBlockTime(
                    await provider.getBlockNumber(),
                    _cooldown.toNumber()
                )
            );
        }, 10000);
        setClaimCooldown(
            estimateBlockTime(
                await provider.getBlockNumber(),
                _cooldown.toNumber()
            )
        );
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
        if (!contract || !signer) {
            return;
        }
        const tx = await (
            contract.connect(signer) as Contract & Community
        ).claim();
        const response = await tx.wait();

        updateClaimData();

        return response;
    };

    useEffect(() => {
        if (communityAddress) {
            setContract(communityContract(communityAddress));
        }
        if (address && communityAddress) {
            const data = localStorage.getItem(
                `@beneficiary/claim-${communityAddress}`
            );
            if (data) {
                const parsed = JSON.parse(data);
                setBeneficiary({
                    claimedAmount: BigNumber.from(parsed.claimedAmount),
                    lastClaim: BigNumber.from(parsed.lastClaim)
                });
            }
        }
        return () => {
            clearInterval(refreshInterval);
        };
    }, [communityAddress, address]);

    return { claim, beneficiary, claimCooldown, refreshClaimCooldown };
};
