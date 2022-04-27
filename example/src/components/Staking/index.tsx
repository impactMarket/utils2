import React from 'react';
import WalletConnection from '../WalletConnection';
import { useStaking } from '@impact-market/utils/useStaking';
import { usePACTBalance } from '@impact-market/utils/usePACTBalance';
import ApproveStake from './ApproveStake';

const PACTMetrics = () => {
    const { staking } = useStaking();
    const balancePACT = usePACTBalance();

    return (
        <WalletConnection title="Staking">
            <ul>
                <li style={{ marginTop: 16 }}>
                    <div>pact: {balancePACT}</div>
                </li>
                <li style={{ marginTop: 16 }}>
                    <div>stakedAmount: {staking.stakedAmount}</div>
                </li>
            </ul>
            <ApproveStake />
        </WalletConnection>
    );
}

export default PACTMetrics;
