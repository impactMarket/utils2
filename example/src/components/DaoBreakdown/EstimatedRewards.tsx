import React from 'react';
import { useRewards } from '@impact-market/utils';

const EstimatedRewards = () => {
    const { rewards } = useRewards();

    return (
        <>
            <h3>Estimated Rewards</h3>
            <div style={{ marginTop: 8 }}>
                {rewards?.estimated}
            </div>
        </>
    )
}

export default EstimatedRewards;
