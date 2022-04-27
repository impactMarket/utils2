import { ImpactProviderContext, PACTBalanceContext, StakingContext } from './ImpactProvider';
import { executeTransaction } from './executeTransaction';
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
        const response = await executeTransaction(connection, address, cusd.address, tx);
        
        const stakedAmount = await staking.stakeholderAmount(address);
        
        console.log(stakedAmount, toNumber(stakedAmount));
        const updatedPACTBalance = await updatePACTBalance(provider, address);

        setBalance(updatedPACTBalance);
        setStaking((s) => ({ ...s, stakedAmount: toNumber(stakedAmount) }));

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
            const { staking } = await getContracts(provider);
            const stakedAmount = await staking.stakeholderAmount(address);

            setStaking((s) => ({ ...s, initialised: true, stakedAmount: toNumber(stakedAmount) }));
        };

        getStakeholderAmount();
    }, []);

    return { approve, claim, stake, stakeRewards, staking, unstake };
};
