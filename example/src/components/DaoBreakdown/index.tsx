import React from 'react';
import ApproveDonate from './ApproveDonate';
import Balance from './Balance';
import ClaimableRewards from './ClaimableRewards';
import Epoch from './Epoch';
import EstimatedRewards from './EstimatedRewards';
import WalletConnection from '../WalletConnection';
import MerkleDistributor from './MerkleDistributor';

const DaoBreakdown = props => {
    return (
        <WalletConnection title="DAO Breakdown">
            <ul>
                <li style={{ marginTop: 16 }}>
                    <Balance />
                </li>
                <li style={{ marginTop: 16 }}>
                    <ApproveDonate />
                </li>
                <li style={{ marginTop: 16 }}>
                    <ClaimableRewards />
                </li>
                <li style={{ marginTop: 16 }}>
                    <EstimatedRewards />
                </li>
                <li style={{ marginTop: 16 }}>
                    <Epoch />
                </li>
                <li style={{ marginTop: 16 }}>
                    <MerkleDistributor />
                </li>
            </ul>
        </WalletConnection>
    );
}

export default DaoBreakdown;
