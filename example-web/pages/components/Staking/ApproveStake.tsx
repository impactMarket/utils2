import React, { useState } from 'react';
import { useStaking } from '@impact-market/utils/useStaking';

const ApproveStake = () => {
    const staking = useStaking();
    const [approvedAmount, setApprovedAmount] = useState(false);
    const [stakingIsLoading, setStakingIsLoading] = useState(false);
    const [stakingAmount, setStakingAmount] = useState('');


    const approveStaking = async () => {
        setStakingIsLoading(true);

        const response = await staking.approve(stakingAmount);

        setStakingIsLoading(false);

        if (response?.status) {
            setApprovedAmount(true);
        }
    }

    const executeStaking = async () => {
        setStakingIsLoading(true);

        const response = await staking.stake(stakingAmount);

        setStakingIsLoading(false);

        if (response?.status) {
            setApprovedAmount(false);
        }
    }

    return (
        <>
            <h3>Approve & Stake</h3>
            <div style={{ marginTop: 8 }}>
                <input disabled={stakingIsLoading} onChange={event => setStakingAmount(event.target.value)} type="number" value={stakingAmount || ''} />
                <button disabled={stakingIsLoading || approvedAmount} onClick={approveStaking}>Approve</button>
                <button disabled={stakingIsLoading || !approvedAmount} onClick={executeStaking}>Stake</button>
                {stakingIsLoading && <span> Loading...</span>}
            </div>
        </>
    )
}

export default ApproveStake;
