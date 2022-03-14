import { Contract } from '@ethersproject/contracts';
import { getContracts } from './contracts';
import { toNumber } from './toNumber';
import type { BaseProvider } from '@ethersproject/providers';

export const updateEpochData = async (provider: BaseProvider) => {
    const { donationMiner } = await getContracts(provider);

    const currentBlock = await provider.getBlockNumber();
    const period = await donationMiner.rewardPeriodCount();

    const response = await donationMiner.rewardPeriods(period);

    const { rewardAmount, endBlock, donationsAmount } = response || {};

    // calculate remaining time until the end block, in seconds.
    // If the end block was in the past, add another epoch.
    const isFuture = currentBlock > endBlock.toNumber();
    // ~ amount of blocks in a day
    const blocksPerDay = 12 * 60 * 24;
    const blockTime = (endBlock.toNumber() - currentBlock + (isFuture ? blocksPerDay : 0)) * 5000;

    const endPeriod = new Date(new Date().getTime() + blockTime);

    const rewards = toNumber(rewardAmount);
    const totalRaised = isFuture ? 0 : toNumber(donationsAmount);

    return {
        endPeriod: endPeriod.toISOString(),
        rewards,
        totalRaised
    };
};

export const updateUserContributionData = async (provider: BaseProvider, address: string) => {
    const { donationMiner } = await getContracts(provider);

    const currentBlock = await provider.getBlockNumber();
    const period = await donationMiner.rewardPeriodCount();

    const response = await donationMiner.rewardPeriods(period);

    const { endBlock } = response || {};

    // calculate remaining time until the end block, in seconds.
    // If the end block was in the past, add another epoch.
    const isFuture = currentBlock > endBlock.toNumber();

    const amount = await donationMiner.rewardPeriodDonorAmount(period, address);
    const userContribution = isFuture ? 0 : toNumber(amount);

    return {
        userContribution
    };
};

/**
 * Estimated rewards for the current period + the claim delay window.
 * @param {Contract} donationMiner The donation miner contract.
 * @param {string} address The address of the user.
 * @returns {number} Estimated rewards.
 */
export const getEstimatedClaimableRewards = async (donationMiner: Contract, address: string) => {
    const rewardPeriodCount = await donationMiner.rewardPeriodCount();
    const claimDelay = await donationMiner.claimDelay();
    const claimableDonations = await donationMiner.calculateClaimableRewardsByPeriodNumber(
        address,
        parseInt(rewardPeriodCount.toString(), 10) - parseInt(claimDelay.toString(), 10) - 1
    );
    const allDonations = await donationMiner.calculateClaimableRewardsByPeriodNumber(
        address,
        parseInt(rewardPeriodCount.toString(), 10) - 1
    );
    const currentEpochDonations = await donationMiner.estimateClaimableReward(address);

    return toNumber(allDonations) - toNumber(claimableDonations) + toNumber(currentEpochDonations);
};

/**
 * Get allocated rewards.
 * @param {Contract} donationMiner The donation miner contract.
 * @param {string} address The address of the user.
 * @returns {number} Allocated rewards.
 */
export const getAllocatedRewards = async (donationMiner: Contract, address: string) => {
    const rewardPeriodCount = await donationMiner.rewardPeriodCount();
    const pastDonations = await donationMiner.calculateClaimableRewardsByPeriodNumber(
        address,
        parseInt(rewardPeriodCount.toString(), 10) - 1
    );

    return toNumber(pastDonations);
};

/**
 * Estimated rewards for the current epoch.
 * @param {Contract} donationMiner The donation miner contract.
 * @param {string} address The address of the user.
 * @returns {number} Current epoch estimated rewards.
 */
export const getCurrentEpochEstimatedRewards = async (donationMiner: Contract, address: string) => {
    const currentEpochDonations = await donationMiner.estimateClaimableReward(address);

    return toNumber(currentEpochDonations);
};

/**
 * Claimable rewards at the moment.
 * @param {Contract} donationMiner The donation miner contract.
 * @param {string} address The address of the user.
 * @returns {number} Claimable rewards.
 */
export const getClaimableRewards = async (donationMiner: Contract, address: string) => {
    const rewardPeriodCount = await donationMiner.rewardPeriodCount();
    const claimDelay = await donationMiner.claimDelay();
    const value = await donationMiner.calculateClaimableRewardsByPeriodNumber(
        address,
        parseInt(rewardPeriodCount.toString(), 10) - parseInt(claimDelay.toString(), 10) - 1
    );

    return toNumber(value);
};

/**
 * Get total donated on X last epochs by a given address and everyone else.
 * @param {Contract} donationMiner The donation miner contract.
 * @param {string} address The address of the user.
 * @returns {number} Last epoch donations.
 */
export const getLastEpochsDonations = async (donationMiner: Contract, address: string) => {
    const rewardPeriodCount = (await donationMiner.rewardPeriodCount()).toNumber();
    const againstPeriods = (await donationMiner.againstPeriods()).toNumber();
    let valueDonated = 0;
    let valueUserDonated = 0;

    // note: doing it this way adds (epochs*2)+2 request to the network.
    // but this is temporary.
    for (let i = rewardPeriodCount - againstPeriods; i <= rewardPeriodCount; i++) {
        const value = await donationMiner.rewardPeriods(i);
        const valueUser = await donationMiner.rewardPeriodDonorAmount(i, address);

        valueDonated += toNumber(value.donationsAmount);
        valueUserDonated += toNumber(valueUser);
    }

    return {
        everyone: valueDonated,
        user: valueUserDonated
    };
};
