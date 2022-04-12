import { ImpactProviderContext } from './ImpactProvider';
import { executeTransaction } from './executeTransaction';
import { getContracts } from './contracts';
import React, { useEffect } from 'react';

export const useStaking = () => {
    const { connection, address, provider } = React.useContext(ImpactProviderContext);
    const [stakeholderAmount, setStakeholderAmount] = React.useState(0);
    const [stakedAmount, setStakedAmount] = React.useState(0);
    const [apr,] = React.useState(0);
    const [earned,] = React.useState(0);

    /**
     * Stake a given amount of tokens from wallet balance
     * @param {string} holder Holder address
     * @param {string} amount Amount to be staked
     * @returns {ethers.ContractReceipt} transaction response object
     * @example
     * ```typescript
     * const { stake } = useStaking();
     * const tx = await stake('holder-address', 'amount');
     * ```
     */
    const stake = async (holder: string, amount: string) => {
        if (!connection || !address) {
            return;
        }
        const { staking, cusd } = await getContracts(provider);
        const tx = await staking.populateTransaction.stake(holder, amount);
        const response = await executeTransaction(connection, address, cusd.address, tx);

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
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    /**
     * Unstake a given amount of tokens
     * @param {string} amount Amount to unstake
     * @returns {ethers.ContractReceipt} transaction response object
     */
    const unstake = async (amount: string) => {
        if (!connection || !address) {
            return;
        }
        const { staking, cusd } = await getContracts(provider);
        const tx = await staking.populateTransaction.unstake(amount);
        const response = await executeTransaction(connection, address, cusd.address, tx);

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
        const response = await executeTransaction(connection, address, cusd.address, tx);

        return response;
    };

    // Get stakeholder amount
    useEffect(() => {
        const getStakeholderAmount = async () => {
            if (!connection || !address) {
                return;
            }
            const { staking, spact } = await getContracts(provider);
            const stakeholderAmount = await staking.getStakeholderAmount(address);
            const stakedAmount = await spact.balanceOf(address);
            
            setStakeholderAmount(stakeholderAmount);
            setStakedAmount(stakedAmount);
        };

        getStakeholderAmount();
    }, []);

    return { apr, claim, earned, stake, stakeRewards, stakedAmount, stakeholderAmount, unstake };
};
