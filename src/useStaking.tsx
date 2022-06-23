import { ImpactProviderContext, PACTBalanceContext, StakingContext } from './ImpactProvider';
import { estimateBlockTime } from './estimateBlockTime';
import { executeTransaction } from './executeTransaction';
import { getAllocatedRewards } from './updater';
import { getContracts } from './contracts';
import { toNumber } from './toNumber';
import { toToken } from './toToken';
import { updatePACTBalance } from './usePACTBalance';
import React, { useEffect } from 'react';

export const useStaking = () => {
    const { connection, address, provider } = React.useContext(ImpactProviderContext);
    const { setBalance } = React.useContext(PACTBalanceContext);
    const { staking, setStaking } = React.useContext(StakingContext);

    /**
     * Private method to update staking data.
     * @param {object} staking staking contract object
     * @param {string} address user address
     * @returns {Promise<void>} void
     */
    const _updateStaking = async () => {
        if (!address) {
            return;
        }
        setStaking(s => ({ ...s, initialised: false }));

        const { donationMiner, donationMinerOld, staking, spact } = await getContracts(provider);
        const [updatedPACTBalance, stakedAmount, allocated, apr, unstakeCooldown, totalAmount, spactbalance] =
            await Promise.all([
                updatePACTBalance(provider, address),
                staking.stakeholderAmount(address),
                getAllocatedRewards(donationMiner, donationMinerOld, address),
                donationMiner.apr(address),
                staking.cooldown(),
                staking.currentTotalAmount(),
                spact.balanceOf(address)
            ]);

        const unstaked = toNumber(spactbalance) - toNumber(stakedAmount);
        // TODO: temporary fallback
        let claimable = 0;
        let estimateClaimableRewardByStaking = 0;
        let generalAPR = 0;

        try {
            claimable = toNumber(await staking.claimAmount(address));
        } catch (_) {}
        try {
            estimateClaimableRewardByStaking = toNumber(await staking.estimateClaimableRewardByStaking(address));
        } catch (_) {}
        try {
            generalAPR = toNumber(await staking.generalApr());
        } catch (_) {}

        setBalance(updatedPACTBalance);
        setStaking(s => ({
            ...s,
            allocated,
            claimableUnstaked: claimable,
            estimateClaimableRewardByStaking,
            generalAPR,
            initialised: true,
            stakedAmount: toNumber(stakedAmount),
            totalStaked: toNumber(totalAmount),
            unstakeCooldown: unstakeCooldown.toNumber() / 17280,
            unstaked,
            userAPR: toNumber(apr)
        }));
    };

    /**
     * Stake a given amount of tokens from wallet balance
     * @param {string | number} value Amount to be staked
     * @returns {ethers.ContractReceipt} transaction response object
     * @example
     * ```typescript
     * const { stake } = useStaking();
     * const tx = await stake('holder-address', 'amount');
     * ```
     */
    const stake = async (value: string | number) => {
        if (!connection || !address) {
            return;
        }
        const amount = toToken(value, { EXPONENTIAL_AT: 29 });
        const { staking, cusd } = await getContracts(provider);

        const tx = await staking.populateTransaction.stake(address, amount);
        const response = await executeTransaction(connection, address, cusd, tx);

        await _updateStaking();

        return response;
    };

    /**
     * Approve PACT tokens to be moved to staking by staking contract
     * @param {string | number} value Amount to approve to stake
     * @returns {ethers.ContractReceipt} transaction response object
     */
    const approve = async (value: string | number) => {
        if (!connection || !address) {
            return;
        }
        const amount = toToken(value, { EXPONENTIAL_AT: 29 });
        const { pact, staking, cusd } = await getContracts(provider);

        const PACTAllowance = await pact.allowance(address, staking.address);
        const pactAllowance = toNumber(PACTAllowance);
        const allowance = pactAllowance || 0;

        if (allowance >= Number(value)) {
            return { status: true };
        }
        const tx = await pact.populateTransaction.approve(staking.address, amount);
        const response = await executeTransaction(connection, address, cusd, tx);

        return response;
    };

    /**
     * Stake tokens from rewards without claiming
     * @returns {ethers.ContractReceipt} transaction response object
     */
    const stakeRewards = async () => {
        if (!connection || !address) {
            return;
        }
        const { donationMiner, cusd } = await getContracts(provider);
        const tx = await donationMiner.populateTransaction.stakeRewards();
        const response = await executeTransaction(connection, address, cusd, tx);

        await _updateStaking();

        return response;
    };

    /**
     * Unstake a given amount of tokens
     * @param {string | number} value Amount to unstake
     * @returns {ethers.ContractReceipt} transaction response object
     */
    const unstake = async (value: string | number) => {
        if (!connection || !address) {
            return;
        }
        const amount = toToken(value, { EXPONENTIAL_AT: 29 });
        const { staking, cusd } = await getContracts(provider);
        const tx = await staking.populateTransaction.unstake(amount);
        const response = await executeTransaction(connection, address, cusd, tx);

        await _updateStaking();

        return response;
    };

    /**
     * Claim unstaked tokens
     * @returns {ethers.ContractReceipt} transaction response object
     */
    const claim = async () => {
        if (!connection || !address) {
            return;
        }
        const { staking, cusd } = await getContracts(provider);
        const tx = await staking.populateTransaction.claim();
        const response = await executeTransaction(connection, address, cusd, tx);

        await _updateStaking();

        return response;
    };

    /**
     * Get user unstake details
     * @returns {any} user unstake details
     */
    const unstakingUserInfo = async () => {
        if (!connection || !address) {
            return;
        }
        const { staking } = await getContracts(provider);
        const _stakeholder = await staking.stakeholder(address);
        const blockNumber = await provider.getBlockNumber();

        const info = [];

        for (let index = _stakeholder[1].toNumber(); index < _stakeholder[2].toNumber(); index++) {
            const _info = await staking.stakeholderUnstakeAt(address, index);

            info.push({
                amount: toNumber(_info[0]),
                cooldown: Math.floor(estimateBlockTime(blockNumber, _info[1].toNumber()).getTime() / 1000)
            });
        }

        return info;
    };

    // Get stakeholder amount
    useEffect(() => {
        const getStakeholderAmount = async () => {
            if (!connection || !address) {
                return;
            }
            const { donationMiner, donationMinerOld, staking, spact } = await getContracts(provider);
            const [stakedAmount, allocated, apr, unstakeCooldown, totalAmount, spactbalance] = await Promise.all([
                staking.stakeholderAmount(address),
                getAllocatedRewards(donationMiner, donationMinerOld, address),
                donationMiner.apr(address),
                staking.cooldown(),
                staking.currentTotalAmount(),
                spact.balanceOf(address)
            ]);

            const unstaked = toNumber(spactbalance) - toNumber(stakedAmount);
            // TODO: temporary fallback
            let claimable = 0;
            let estimateClaimableRewardByStaking = 0;
            let generalAPR = 0;

            try {
                claimable = toNumber(await staking.claimAmount(address));
            } catch (_) {}
            try {
                estimateClaimableRewardByStaking = toNumber(
                    await donationMiner.estimateClaimableRewardByStaking(address)
                );
            } catch (_) {}
            try {
                // generalAPR = toNumber(await donationMiner.generalApr());

                const period = await donationMiner.rewardPeriodCount();
                generalAPR = 365 * 100 * toNumber((await donationMiner.rewardPeriods(period)).rewardAmount) /
                    (toNumber((await donationMiner.lastPeriodsDonations(address)).totalAmount) * 10000 + toNumber(totalAmount))
            } catch (_) {}

            setStaking(s => ({
                ...s,
                allocated,
                claimableUnstaked: claimable,
                estimateClaimableRewardByStaking,
                generalAPR,
                initialised: true,
                stakedAmount: toNumber(stakedAmount),
                totalStaked: toNumber(totalAmount),
                unstakeCooldown: unstakeCooldown.toNumber() / 17280,
                unstaked,
                userAPR: toNumber(apr)
            }));
        };

        getStakeholderAmount();
    }, []);

    return { approve, claim, stake, stakeRewards, staking, unstake, unstakingUserInfo };
};
