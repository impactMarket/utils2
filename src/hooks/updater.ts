import { Contract } from '@ethersproject/contracts';
import { BaseProvider } from '@ethersproject/providers';
import { estimateBlockTime } from '../helpers/estimateBlockTime';
import { toNumber } from '../helpers/toNumber';
import { getContracts } from '../utils/contracts';

export const updateEpochData = async (provider: BaseProvider) => {
    const { donationMiner } = await getContracts(provider);

    const currentBlock = await provider.getBlockNumber();
    const period = await donationMiner.rewardPeriodCount();
    const response = await donationMiner.rewardPeriods(period);
    const { rewardAmount, endBlock, donationsAmount } = response;

    const isFuture = currentBlock > endBlock.toNumber();
    const endPeriod = estimateBlockTime(currentBlock, endBlock.toNumber());
    let rewards = 0;
    let totalRaised = 0;
    if (isFuture) {
        rewards = toNumber(rewardAmount);
        totalRaised = toNumber(donationsAmount);
    }

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

/**
 * Estimated rewards for the current period + the claim delay window.
 * @returns a number
 */
export const getEstimatedClaimableRewards = async (
    donationMiner: Contract,
    address: string
) => {
    const rewardPeriodCount = await donationMiner.rewardPeriodCount();
    const claimDelay = await donationMiner.claimDelay();
    const claimableDonations =
        await donationMiner.calculateClaimableRewardsByPeriodNumber(
            address,
            parseInt(rewardPeriodCount.toString(), 10) -
                parseInt(claimDelay.toString(), 10)
        );
    const allDonations =
        await donationMiner.calculateClaimableRewardsByPeriodNumber(
            address,
            parseInt(rewardPeriodCount.toString(), 10)
        );
    const currentEpochDonations = await donationMiner.estimateClaimableReward(
        address
    );
    return (
        toNumber(allDonations) -
        toNumber(claimableDonations) +
        toNumber(currentEpochDonations)
    );
};

/**
 * Claimable rewards at the moment.
 * @returns a number
 */
export const getClaimableRewards = async (
    donationMiner: Contract,
    address: string
) => {
    const rewardPeriodCount = await donationMiner.rewardPeriodCount();
    const claimDelay = await donationMiner.claimDelay();
    const value = await donationMiner.calculateClaimableRewardsByPeriodNumber(
        address,
        parseInt(rewardPeriodCount.toString(), 10) -
            parseInt(claimDelay.toString(), 10)
    );
    return toNumber(value);
};
