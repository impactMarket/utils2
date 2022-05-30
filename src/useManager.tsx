import { ImpactProviderContext } from './ImpactProvider';
import { communityContract } from './community';
import { estimateBlockTime } from './estimateBlockTime';
import { estimateRemainingFundsInDays } from './estimateRemainingFundsInDays';
import { executeTransaction } from './executeTransaction';
import { filterEvent } from './filterEvent';
import { getContracts } from './contracts';
import { toNumber } from './toNumber';
import React, { useEffect, useState } from 'react';
import type { CeloTxReceipt } from '@celo/connect';

export const useManager = (communityAddress: string) => {
    const { connection, address, provider, subgraph } = React.useContext(ImpactProviderContext);
    const [isReady, setIsReady] = useState(false);
    const [nextRequestFundsAvailability, setNextRequestFundsAvailability] = useState(new Date(0));
    const [fundsRemainingDays, setFundsRemainingDays] = useState<number>(0);
    const [canRequestFunds, setCanRequestFunds] = useState(false);

    /**
     * Add beneficiary to community
     * @param {string} beneficiaryAddress Beneficiary address to be added
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "No connection"
     * @throws {Error} "Community: NOT_MANAGER"
     * @example
     * ```typescript
     * const { addBeneficiary } = useManager('community-address');
     * const tx = await addBeneficiary('beneficiary-address');
     * ```
     */
    const addBeneficiary = async (beneficiaryAddress: string): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.addBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Remove beneficiary from community
     * @param {string} beneficiaryAddress Beneficiary address to be removed
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "No connection"
     * @throws {Error} "Community: NOT_MANAGER"
     * @throws {Error} "Community::removeBeneficiary: NOT_YET"
     * @example
     * ```typescript
     * const { removeBeneficiary } = useManager('community-address');
     * const tx = await removeBeneficiary('beneficiary-address');
     * ```
     */
    const removeBeneficiary = async (beneficiaryAddress: string): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.removeBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Lock beneficiary in community
     * @param {string} beneficiaryAddress Beneficiary address to be locked
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "No connection"
     * @throws {Error} "Community: NOT_MANAGER"
     * @throws {Error} "Community::lockBeneficiary: NOT_YET"
     * @example
     * ```typescript
     * const { lockBeneficiary } = useManager('community-address');
     * const tx = await lockBeneficiary('beneficiary-address');
     * ```
     */
    const lockBeneficiary = async (beneficiaryAddress: string): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.lockBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Unlock beneficiary in community
     * @param {string} beneficiaryAddress Beneficiary address to be unlocked
     * @returns {Promise<CeloTxReceipt>} transaction response object
     * @throws {Error} "No connection"
     * @throws {Error} "Community: NOT_MANAGER"
     * @throws {Error} "Community::unlockBeneficiary: NOT_YET"
     * @example
     * ```typescript
     * const { unlockBeneficiary } = useManager('community-address');
     * const tx = await unlockBeneficiary('beneficiary-address');
     * ```
     */
    const unlockBeneficiary = async (beneficiaryAddress: string): Promise<CeloTxReceipt> => {
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.unlockBeneficiary(beneficiaryAddress);
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Allow manager to request funds from the DAO treasury
     * @returns {Promise<number>} amount received from the reserve
     * @throws {Error} "No connection"
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
        if (!connection || !address) {
            throw new Error('No connection');
        }
        const { cusd } = await getContracts(provider);
        const tx = await communityContract(communityAddress).populateTransaction.requestFunds();
        const response = await executeTransaction(connection, address, cusd.address, tx);

        const received = filterEvent(
            'event CommunityFunded(address indexed community, uint256 amount)',
            'CommunityFunded',
            response
        );

        return parseInt(received.args![1].toString(), 10);
    };

    useEffect(() => {
        // load request funds interval
        const loadRequestFundsTimeInterval = async () => {
            if (!connection || !address) {
                return;
            }
            const { cusd } = await getContracts(provider);
            const _communityContract = communityContract(communityAddress, provider);
            const [_currentBlockNumber, baseInterval, lastFundRequest, minTranche, communityBalance, communityGraph] =
                await Promise.all([
                    provider.getBlockNumber(),
                    _communityContract.baseInterval(),
                    _communityContract.lastFundRequest(),
                    _communityContract.minTranche(),
                    cusd.balanceOf(communityAddress),
                    subgraph.getCommunityData(communityAddress, '{ baseInterval, claimAmount, beneficiaries }')
                ]);

            if (parseInt(lastFundRequest, 10) === 0) {
                setCanRequestFunds(toNumber(communityBalance) < toNumber(minTranche));
            } else {
                const nextRequestFundsBlock = parseInt(lastFundRequest, 10) + parseInt(baseInterval, 10);

                setNextRequestFundsAvailability(estimateBlockTime(_currentBlockNumber, nextRequestFundsBlock));
                setCanRequestFunds(
                    toNumber(communityBalance) < toNumber(minTranche) && nextRequestFundsBlock >= _currentBlockNumber
                );
            }
            setFundsRemainingDays(
                estimateRemainingFundsInDays({
                    baseInterval: communityGraph.baseInterval!,
                    beneficiaries: communityGraph.beneficiaries!,
                    claimAmount: parseFloat(communityGraph.claimAmount!),
                    fundsOnContract: toNumber(communityBalance)
                })
            );
            setIsReady(true);
        };

        loadRequestFundsTimeInterval();
    }, []);

    return {
        addBeneficiary,
        canRequestFunds,
        fundsRemainingDays,
        isReady,
        lockBeneficiary,
        nextRequestFundsAvailability,
        removeBeneficiary,
        requestFunds,
        unlockBeneficiary
    };
};
