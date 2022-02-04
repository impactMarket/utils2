import { useEffect, useState } from 'react';
import { communityContract } from './community';
import { Contract } from '@ethersproject/contracts';
import { estimateBlockTime } from './estimateBlockTime';
import { toNumber } from './toNumber';
import { BaseProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';

export const useBeneficiary = (props: {
    communityAddress: string;
    address: string;
    signer: Signer | null;
    provider: BaseProvider;
}) => {
    const [isReady, setIsReady] = useState(false);
    const [beneficiary, setBeneficiary] = useState<{
        claimedAmount: number;
    }>({
        claimedAmount: 0
    });
    const [claimCooldown, setClaimCooldown] = useState(new Date(0));
    const [contract, setContract] = useState<Contract | null>(null);
    const { address, signer, provider, communityAddress } = props;
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
     * Beneficiary claim.
     * Should update cUSD balance by the end of the claim.
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
        const tx = await (contract.connect(signer) as Contract).claim();
        const response = await tx.wait();

        updateClaimData(contract);

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
