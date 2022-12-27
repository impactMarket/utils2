import { Contract } from '@ethersproject/contracts';
import { ImpactProviderContext } from './ImpactProvider';
import { Interface, defaultAbiCoder } from '@ethersproject/abi';
import { getContracts } from './contracts';
import { internalUseTransaction } from './internalUseTransaction';
import { toToken } from './toToken';
import BaseERC20ABI from './abi/BaseERC20.json';
import ImpactMarketCouncilABI from './abi/ImpactMarketCouncil.json';
import React from 'react';

export const useLearnAndEarn = () => {
    const { provider, address, connection, networkId } = React.useContext(ImpactProviderContext);
    const executeTransaction = internalUseTransaction();

    /**
     * Add a new level.
     * @param {number} levelId Level id (unique identifier) to create
     * @param {string} token Token used as reward
     * @returns {Promise<number>} proposal id
     */
    const addLevel = async (levelId: number, token: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { impactMarketCouncil, learnAndEarn } = getContracts(provider, networkId);
        const signatures = ['addLevel(uint256,address)'];

        const calldatas = [defaultAbiCoder.encode(['uint256', 'address'], [levelId, token])];

        const tx = await impactMarketCouncil.populateTransaction.propose(
            [learnAndEarn.address],
            signatures,
            calldatas,
            JSON.stringify({
                description: `Adding level id ${levelId} with token ${token}.`,
                title: 'Learn and Earn: Add New Level'
            })
        );
        const response = await executeTransaction(tx);
        const ifaceCouncil = new Interface(ImpactMarketCouncilABI);

        return parseInt(ifaceCouncil.parseLog(response.logs[0]).args![0].toString(), 10);
    };

    /**
     * Pause a level.
     * @param {number} levelId Level id to pause
     * @returns {Promise<number>} proposal id
     */
    const pauseLevel = async (levelId: number) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { impactMarketCouncil, learnAndEarn } = getContracts(provider, networkId);
        const signatures = ['pauseLevel(uint256)'];

        const calldatas = [defaultAbiCoder.encode(['uint256'], [levelId])];

        const tx = await impactMarketCouncil.populateTransaction.propose(
            [learnAndEarn.address],
            signatures,
            calldatas,
            JSON.stringify({
                description: `Pausing level id ${levelId}.`,
                title: 'Learn and Earn: Pausing Level'
            })
        );
        const response = await executeTransaction(tx);
        const ifaceCouncil = new Interface(ImpactMarketCouncilABI);

        return parseInt(ifaceCouncil.parseLog(response.logs[0]).args![0].toString(), 10);
    };

    /**
     * Unpause a paused level.
     * @param {number} levelId Level id to unpause
     * @returns {Promise<number>} proposal id
     */
    const unpauseLevel = async (levelId: number) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { impactMarketCouncil, learnAndEarn } = getContracts(provider, networkId);
        const signatures = ['unpauseLevel(uint256)'];

        const calldatas = [defaultAbiCoder.encode(['uint256'], [levelId])];

        const tx = await impactMarketCouncil.populateTransaction.propose(
            [learnAndEarn.address],
            signatures,
            calldatas,
            JSON.stringify({
                description: `Unpausing level id ${levelId}.`,
                title: 'Learn and Earn: Unpause Level'
            })
        );
        const response = await executeTransaction(tx);
        const ifaceCouncil = new Interface(ImpactMarketCouncilABI);

        return parseInt(ifaceCouncil.parseLog(response.logs[0]).args![0].toString(), 10);
    };

    /**
     * Cancel a level.
     * @param {number} levelId Level id to cancel
     * @param {string} fundRecipient Address to returns the funds to
     * @returns {Promise<number>} proposal id
     */
    const cancelLevel = async (levelId: number, fundRecipient: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { impactMarketCouncil, learnAndEarn } = getContracts(provider, networkId);
        const signatures = ['cancelLevel(uint256,address)'];

        const calldatas = [defaultAbiCoder.encode(['uint256', 'address'], [levelId, fundRecipient])];

        const tx = await impactMarketCouncil.populateTransaction.propose(
            [learnAndEarn.address],
            signatures,
            calldatas,
            JSON.stringify({
                description: `Canceling level id ${levelId} with fund's recipient ${fundRecipient}.`,
                title: 'Learn and Earn: Cancel Level'
            })
        );
        const response = await executeTransaction(tx);
        const ifaceCouncil = new Interface(ImpactMarketCouncilABI);

        return parseInt(ifaceCouncil.parseLog(response.logs[0]).args![0].toString(), 10);
    };

    /**
     * Fund level. Should approve token first.
     * @param {number} levelId Level id to fund
     * @param {number} amount Amount (decimal format) in to fund
     * @returns {Promise<CeloTxReceipt>} tx response object
     */
    const fundLevel = async (levelId: number, amount: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { learnAndEarn } = getContracts(provider, networkId);
        const tx = await learnAndEarn.populateTransaction.fundLevel(levelId, toToken(amount));
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Approve token to fund level.
     * @param {string} token Token to be approved
     * @param {number} amount Amount (decimal format) in to fund
     * @returns {Promise<CeloTxReceipt>} tx response object
     */
    const approveToken = async (token: string, amount: string) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { learnAndEarn } = getContracts(provider, networkId);
        const tokenContract = new Contract(token, BaseERC20ABI, provider);
        const tx = await tokenContract.populateTransaction.approve(learnAndEarn.address, toToken(amount));
        const response = await executeTransaction(tx);

        return response;
    };

    /**
     * Claims airgrab rewards.
     * @param {string} beneficiary Beneficiary to receive rewards
     * @param {number[]} levelIds Level IDs to claim rewards for
     * @param {number[]} rewardAmounts Amounts (decimal format) to claim
     * @param {string[]} signatures Signatures for each level
     * @returns {Promise<CeloTxReceipt>} tx response object
     */
    const claimRewardForLevels = async (
        beneficiary: string,
        levelIds: number[],
        rewardAmounts: number[],
        signatures: string[]
    ) => {
        if (!address || !connection) {
            throw new Error('No wallet connected');
        }

        const { learnAndEarn } = getContracts(provider, networkId);
        const tx = await learnAndEarn.populateTransaction.claimRewardForLevels(
            beneficiary,
            levelIds,
            rewardAmounts.map((r) => toToken(r)),
            signatures
        );
        const response = await executeTransaction(tx);

        return response;
    };

    return { addLevel, approveToken, cancelLevel, claimRewardForLevels, fundLevel, pauseLevel, unpauseLevel };
};
