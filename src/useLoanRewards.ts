import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { useContext, useState } from 'react';

export const useLoanRewards = () => {
    const { provider, networkId } = useContext(ImpactProviderContext);
    const [isReady, setIsReady] = useState(false);
    const [rewards, setRewards] = useState<bigint | null>(null);

    async function getEstimatedLoanRewards(value: string) {
        const { donationMiner } = getContracts(provider, networkId);
        const estimatedDonationReward = await donationMiner.estimateNewDonationClaimableRewardAdvance(value);
        const result = BigInt(estimatedDonationReward) / BigInt(3);

        setRewards(result);
        setIsReady(true);
    }

    return { getEstimatedLoanRewards, isReady, rewards };
};
