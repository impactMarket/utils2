import { ImpactProviderContext, PACTBalanceContext, RewardsContext } from './ImpactProvider';
import {
    getAllocatedRewards,
    getClaimableRewards,
    getCurrentEpochEstimatedRewards,
    getEstimatedClaimableRewards
} from './updater';
import { getContracts } from './contracts';
import { updatePACTBalance } from './usePACTBalance';
import React, { useEffect } from 'react';
import type { CeloProvider } from './ethers-wrapper/CeloProvider';

export const updateRewards = async (provider: CeloProvider, address: string) => {
    if (!address) {
        return;
    }
    const { donationMiner } = await getContracts(provider);
    const [estimated, claimable, currentEpoch, allocated] = await Promise.all([
        getEstimatedClaimableRewards(donationMiner, address),
        getClaimableRewards(donationMiner, address),
        getCurrentEpochEstimatedRewards(donationMiner, address),
        getAllocatedRewards(donationMiner, address)
    ]);

    return {
        allocated,
        claimable,
        currentEpoch,
        estimated
    };
};

export const useRewards = () => {
    const { provider, address, signer } = React.useContext(ImpactProviderContext);
    const { setBalance } = React.useContext(PACTBalanceContext);
    const { rewards, setRewards } = React.useContext(RewardsContext);

    /**
     * Claims rewards.
     * @returns {ethers.TransactionReceipt} transaction response object
     */
    const claim = async () => {
        if (!signer || !address) {
            throw new Error('No signer or address');
        }
        try {
            const { donationMiner } = await getContracts(provider);
            const tx = await donationMiner.populateTransaction.claimRewards();
            const gasLimit = await signer.estimateGas(tx);
            const gasPrice = await signer.getGasPrice();
            
            // Gas estimation doesn't currently work properly
            // The gas limit must be padded to increase tx success rate
            // TODO: Investigate more efficient ways to handle this case
            const adjustedGasLimit = gasLimit.mul(2);

            const txResponse = await signer.sendTransaction({
                ...tx,
                gasLimit: adjustedGasLimit,
                gasPrice,
            })
            const response = await txResponse.wait();

            setRewards(rewards => ({
                ...rewards,
                initialised: false
            }));
            const updatedRewards = await updateRewards(provider, address);

            setRewards(rewards => ({
                ...rewards,
                ...updatedRewards,
                initialised: true
            }));
            const updatedPACTBalance = await updatePACTBalance(provider, address);

            setBalance(updatedPACTBalance);

            return response;
        } catch (error) {
            // console.log('Error in claim function: \n', error);
            setRewards(rewards => ({
                ...rewards,
                initialised: true
            }));
            throw error;
        }
    };

    useEffect(() => {
        if (address) {
            updateRewards(provider, address).then(updatedRewards =>
                setRewards(rewards => ({
                    ...rewards,
                    ...updatedRewards,
                    initialised: true
                }))
            );
        }
    }, [address]);

    return { claim, rewards };
};
