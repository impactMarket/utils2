import React, { useState } from 'react';
import { useRewards } from '@impact-market/utils';

const ClaimableRewards = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { claimRewards, rewards } = useRewards();

    const claim = async () => {
        setIsLoading(true);
        const response = await claimRewards();

        console.log(response);

        setIsLoading(false)
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
        </>
    )
}

export default ClaimableRewards;
