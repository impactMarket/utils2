import { ImpactProviderContext } from './ImpactProvider';
import { executeTransaction } from './executeTransaction';
import { getContracts } from './contracts';
import React, { useEffect } from 'react';

export const useStaking = () => {
    const { connection, address, provider } = React.useContext(ImpactProviderContext);
    const [stakeholderAmount, setStakeholderAmount] = React.useState(0);

    /**
     * Stake a given amount of tokens
     * @param {string} holder Holder address
     * @param {string} amount Amount to be staked
     * @returns {ethers.ContractReceipt} transaction response object
     * @example
     * ```typescript
     * const { addBeneficiary } = useStaking();
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
            const stakeholderAmount = await staking.getStakeholderAmount(address);
            
            setStakeholderAmount(stakeholderAmount);
        };

        getStakeholderAmount();
    }, []);

    return { claim, stake, stakeholderAmount, unstake };
};
