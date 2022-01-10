import { Contract } from '@ethersproject/contracts';
import { BaseProvider } from '@ethersproject/providers';
import { toNumber } from '../helpers/toNumber';
import { getContracts } from '../utils/contracts';

export const updateEpochData = async (provider: BaseProvider) => {
    const { donationMiner } = await getContracts(provider);

    const currentBlock = await provider.getBlockNumber();
    const period = await donationMiner.rewardPeriodCount();

    const response = await donationMiner.rewardPeriods(period);

    const { rewardAmount, endBlock, donationsAmount } = response || {};

    // calculate remaining time until the end block, in seconds.
    // If the end block was in the past, add another epoch.
    const isFuture = currentBlock > endBlock.toNumber();
    const blocksPerDay = 12 * 60 * 24; // ~ amount of blocks in a day
    const blockTime =
        (endBlock.toNumber() - currentBlock + (isFuture ? blocksPerDay : 0)) *
        5000;

    const endPeriod = new Date(new Date().getTime() + blockTime);

    const rewards = toNumber(rewardAmount);
    const totalRaised = isFuture ? 0 : toNumber(donationsAmount);

    return {
        endPeriod: endPeriod.toISOString(),
        rewards,
        totalRaised
    };
};

export const updateUserContributionData = async (
    provider: BaseProvider,
    address: string
) => {
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

export const getEstimatedClaimableRewards = async (
    donationMiner: Contract,
    address: string
) => {
    const value = await donationMiner.estimateClaimableReward(address);
    return toNumber(value);
};

export const getClaimableRewards = async (
    donationMiner: Contract,
    address: string
) => {
    const value = await donationMiner.calculateClaimableRewards(address);
    return toNumber(value);
};
