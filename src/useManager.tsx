import { ImpactProviderContext } from './ImpactProvider';
import { TransactionReceipt } from 'viem';
import { communityContract } from './community';
import { estimateBlockTime } from './estimateBlockTime';
import { estimateRemainingFundsInDays } from './estimateRemainingFundsInDays';
import { filterEvent } from './filterEvent';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toNumber } from './toNumber';
import React, { useEffect, useState } from 'react';

export const useManager = (communityAddress: string) => {
    const { signer, address, provider, subgraph, networkId } = React.useContext(ImpactProviderContext);
    const [isReady, setIsReady] = useState(false);
    const [nextRequestFundsAvailability, setNextRequestFundsAvailability] = useState(new Date(0));
    const [fundsRemainingDays, setFundsRemainingDays] = useState<number>(0);
    const [canRequestFunds, setCanRequestFunds] = useState(false);
    const [community, setCommunity] = useState<{
        hasFunds: boolean;
        maxBeneficiaries: number;
    }>({
        hasFunds: false,
        maxBeneficiaries: 0
    });
    const executeTransaction = internalUseTransaction();

    /**
     * Add beneficiary to community
     * @param {string} beneficiaryAddress Beneficiary address to be added
     * @returns {Promise<TransactionReceipt>} transaction response object
     * @throws {Error} "No signer"
     * @throws {Error} "Community: NOT_MANAGER"
     * @example
     * ```typescript
     * const { addBeneficiary } = useManager('community-address');
     * const tx = await addBeneficiary('beneficiary-address');
     * ```
     */
    const addBeneficiary = async (beneficiaryAddress: string): Promise<TransactionReceipt> => {
        if (!signer || !address) {
            throw new Error('No signer');
        }
        const tx = await communityContract(communityAddress).populateTransaction.addBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Remove beneficiary from community
     * @param {string} beneficiaryAddress Beneficiary address to be removed
     * @returns {Promise<TransactionReceipt>} transaction response object
     * @throws {Error} "No signer"
     * @throws {Error} "Community: NOT_MANAGER"
     * @throws {Error} "Community::removeBeneficiary: NOT_YET"
     * @example
     * ```typescript
     * const { removeBeneficiary } = useManager('community-address');
     * const tx = await removeBeneficiary('beneficiary-address');
     * ```
     */
    const removeBeneficiary = async (beneficiaryAddress: string): Promise<TransactionReceipt> => {
        if (!signer || !address) {
            throw new Error('No signer');
        }
        const tx = await communityContract(communityAddress).populateTransaction.removeBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Lock beneficiary in community
     * @param {string} beneficiaryAddress Beneficiary address to be locked
     * @returns {Promise<TransactionReceipt>} transaction response object
     * @throws {Error} "No signer"
     * @throws {Error} "Community: NOT_MANAGER"
     * @throws {Error} "Community::lockBeneficiary: NOT_YET"
     * @example
     * ```typescript
     * const { lockBeneficiary } = useManager('community-address');
     * const tx = await lockBeneficiary('beneficiary-address');
     * ```
     */
    const lockBeneficiary = async (beneficiaryAddress: string): Promise<TransactionReceipt> => {
        if (!signer || !address) {
            throw new Error('No signer');
        }
        const tx = await communityContract(communityAddress).populateTransaction.lockBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Unlock beneficiary in community
     * @param {string} beneficiaryAddress Beneficiary address to be unlocked
     * @returns {Promise<TransactionReceipt>} transaction response object
     * @throws {Error} "No signer"
     * @throws {Error} "Community: NOT_MANAGER"
     * @throws {Error} "Community::unlockBeneficiary: NOT_YET"
     * @example
     * ```typescript
     * const { unlockBeneficiary } = useManager('community-address');
     * const tx = await unlockBeneficiary('beneficiary-address');
     * ```
     */
    const unlockBeneficiary = async (beneficiaryAddress: string): Promise<TransactionReceipt> => {
        if (!signer || !address) {
            throw new Error('No signer');
        }
        const tx = await communityContract(communityAddress).populateTransaction.unlockBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Allow manager to request funds from the DAO treasury
     * @returns {Promise<number>} amount received from the reserve
     * @throws {Error} "No signer"
     * @throws {Error} "CommunityAdmin::fundCommunity: Not enough funds"
     * @throws {Error} "ERC20: transfer amount exceeds balance"
     * @throws {Error} "Community: NOT_MANAGER"
     * @example
     * ```typescript
     * const { requestFunds } = useManager('community-address');
     * const received = await requestFunds();
     * ```
     */
    const requestFunds = async (): Promise<number> => {
        if (!signer || !address) {
            throw new Error('No signer');
        }
        const tx = await communityContract(communityAddress).populateTransaction.requestFunds();
        const response = await executeTransaction(tx);

        const received = filterEvent(
            'event CommunityFunded(address indexed community, uint256 amount)',
            'CommunityFunded',
            response
        );

        return parseInt(received.args![1].toString(), 10);
    };

    /**
     * Verify if an array of addresses can be beneficiary to the community
     * @param {string[]} addresses Array of user addresses to be beneficiaries
     * @returns {Promise<boolean>} true if all are allowed
     * @throws {Error} "UserNotAllowed: <addresses not allowed>"
     * @example
     * ```typescript
     * const { canUsersBeBeneficiaries } = useManager('community-address');
     * const canBe = await canUsersBeBeneficiaries(['address']);
     * ```
     */
    const canUsersBeBeneficiaries = async (addresses: string[]) => {
        const beneficiaries = await subgraph.findBeneficiaries(addresses, '{ id, state, community { id } }');

        const notAllowed = beneficiaries.filter(
            b => b.state === 0 || b.state === 2 || (b.state === 1 && b.community?.id === communityAddress.toLowerCase())
        );

        if (notAllowed.length > 0) {
            throw new Error(`UserNotAllowed: ${notAllowed.map(b => b.id)}`);
        }

        return true;
    };

    useEffect(() => {
        // load request funds interval
        const loadRequestFundsTimeInterval = async () => {
            if (!signer || !address) {
                return;
            }
            const { cusd, communityAdmin } = getContracts(provider, networkId);
            const _communityContract = communityContract(communityAddress, provider);
            const [_currentBlockNumber, baseInterval, lastFundRequest, communityBalance, communityGraph] =
                await Promise.all([
                    provider.getBlockNumber(),
                    _communityContract.baseInterval(),
                    _communityContract.lastFundRequest(),
                    cusd.balanceOf(communityAddress),
                    subgraph.getCommunityData(
                        communityAddress,
                        '{ baseInterval, claimAmount, beneficiaries, maxBeneficiaries }'
                    )
                ]);

            if (parseInt(lastFundRequest, 10) === 0) {
                const ifTrancheNotZero =
                    parseFloat((await communityAdmin.calculateCommunityTrancheAmount(communityAddress)).toString()) > 0;

                setCanRequestFunds(ifTrancheNotZero);
            } else {
                const nextRequestFundsBlock = parseInt(lastFundRequest, 10) + parseInt(baseInterval, 10);
                const ifTrancheNotZero =
                    parseFloat((await communityAdmin.calculateCommunityTrancheAmount(communityAddress)).toString()) > 0;

                setNextRequestFundsAvailability(estimateBlockTime(_currentBlockNumber, nextRequestFundsBlock));
                setCanRequestFunds(ifTrancheNotZero);
            }
            setFundsRemainingDays(
                estimateRemainingFundsInDays({
                    baseInterval: communityGraph.baseInterval!,
                    beneficiaries: communityGraph.beneficiaries!,
                    claimAmount: parseFloat(communityGraph.claimAmount!),
                    fundsOnContract: toNumber(communityBalance)
                })
            );
            setCommunity(c => ({
                ...c,
                hasFunds: toNumber(communityBalance) > parseFloat(communityGraph.claimAmount!),
                maxBeneficiaries: communityGraph.maxBeneficiaries!
            }));
            setIsReady(true);
        };

        loadRequestFundsTimeInterval();
    }, []);

    return {
        addBeneficiary,
        canRequestFunds,
        canUsersBeBeneficiaries,
        community,
        fundsRemainingDays,
        isReady,
        lockBeneficiary,
        nextRequestFundsAvailability,
        removeBeneficiary,
        requestFunds,
        unlockBeneficiary
    };
};
