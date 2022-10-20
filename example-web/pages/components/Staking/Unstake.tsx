import React, { useState } from 'react';
import { useStaking } from '@impact-market/utils/useStaking';

const Unstake = () => {
    const staking = useStaking();
    const [unstakingIsLoading, setUnstakingIsLoading] = useState(false);
    const [unstakingAmount, setUnstakingAmount] = useState('');

    const executeUnstaking = async () => {
        setUnstakingIsLoading(true);

        await staking.unstake(unstakingAmount);

        setUnstakingIsLoading(false);
    };

    staking.unstakingUserInfo().then(console.log);

    return (
        <>
            <h3>Unstake</h3>
            <div style={{ marginTop: 8 }}>
                <input
                    disabled={unstakingIsLoading}
                    onChange={event => setUnstakingAmount(event.target.value)}
                    type="number"
                    value={unstakingAmount || ''}
                />
                <button disabled={unstakingIsLoading} onClick={executeUnstaking}>
                    Unstake
                </button>
                {unstakingIsLoading && <span> Loading...</span>}
            </div>
        </>
    );
};

export default Unstake;
