import {
    ImpactMarketContext,
    RewardsType
} from '../components/ImpactMarketProvider';
import React, { useEffect } from 'react';
import { getContracts } from '../utils/contracts';

type UseRewardsType = {
    claimRewards: Function;
    rewards?: RewardsType;
};

export const useRewards = (): UseRewardsType => {
    const { rewards, updateRewards, provider, signer } =
        React.useContext(ImpactMarketContext);

    const claimRewards = async () => {
        if (!signer) {
            return;
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

            await updateRewards();

            return response;
        } catch (error) {
            console.log('Error in claim function: \n', error);
            return;
        }
    };

    useEffect(() => {
        updateRewards();
    }, []);

    return { claimRewards, rewards };
};
