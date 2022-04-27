import React, { useState } from 'react';
import { useRewards } from '@impact-market/utils/useRewards';
import { useStaking } from '@impact-market/utils/useStaking';

const ClaimableRewards = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStake, setIsLoadingStake] = useState(false);
    const { claim: claimRewards, rewards } = useRewards();
    const { stakeRewards } = useStaking();

    const claim = async () => {
        setIsLoading(true);
        const response = await claimRewards();

        console.log(response);

        setIsLoading(false)
    }

    const stake = async () => {
        setIsLoadingStake(true);
        const response = await stakeRewards();

        console.log(response);

        setIsLoadingStake(false)
    }

    return (
        <>
            <h3>Rewards</h3>
            <h5>Claimable</h5>
            <div style={{ marginTop: 8 }}>
                {rewards?.claimable}
                {<button disabled={!rewards?.claimable || isLoading} onClick={claim} style={{ marginLeft: 16 }}>Claim rewards</button>}
                {isLoading && <span> Loading...</span>}
            </div>
            <h5>Estimated</h5>
            <div style={{ marginTop: 8 }}>
                {rewards?.estimated}
            </div>
            <h5>Allocated</h5>
            <div style={{ marginTop: 8 }}>
                {rewards?.allocated}
                {<button disabled={!rewards?.allocated || isLoadingStake} onClick={stake} style={{ marginLeft: 16 }}>Stake rewards</button>}
                {isLoadingStake && <span> Loading...</span>}
            </div>
            <h5>Current Epoch</h5>
            <div style={{ marginTop: 8 }}>
                {rewards?.currentEpoch}
            </div>
        </>
    )
}

export default ClaimableRewards;
