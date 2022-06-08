import React from 'react';
import WalletConnection from '../WalletConnection';
import { useStaking } from '@impact-market/utils/useStaking';
import { usePACTBalance } from '@impact-market/utils/usePACTBalance';
import ApproveStake from './ApproveStake';
import Unstake from './Unstake';
import ClaimUnstaked from './Claim';

const Staking = () => {
    const { staking } = useStaking();
    const balancePACT = usePACTBalance();

    return (
        <WalletConnection title="Staking">
            <ul>
                <li style={{ marginTop: 16 }}>
                    <div>pact: {balancePACT}</div>
                </li>
                <li style={{ marginTop: 16 }}>
                    <div>stakedAmount: {staking.stakedAmount} PACT</div>
                </li>
                <li style={{ marginTop: 16 }}>
                    <div>userAPR: {staking.userAPR}%</div>
                </li>
                <li style={{ marginTop: 16 }}>
                    <div>generalAPR: {staking.generalAPR}%</div>
                </li>
                <li style={{ marginTop: 16 }}>
                    <div>claimableUnstaked: {staking.claimableUnstaked} PACT</div>
                </li>
                <li style={{ marginTop: 16 }}>
                    <div>estimateClaimableRewardByStaking: {staking.estimateClaimableRewardByStaking} PACT</div>
                </li>
                <li style={{ marginTop: 16 }}>
                    <div>allocated: {staking.allocated} PACT</div>
                </li>
                <li style={{ marginTop: 16 }}>
                    <div>unstakeCooldown: {staking.unstakeCooldown}</div>
                </li>
                <li style={{ marginTop: 16 }}>
                    <div>initialised: {staking.initialised.toString()}</div>
                </li>
            </ul>
            <ApproveStake />
            <Unstake />
            <ClaimUnstaked />
        </WalletConnection>
    );
};

export default Staking;
