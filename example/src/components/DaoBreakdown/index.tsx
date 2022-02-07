import React from 'react';
import ApproveDonate from './ApproveDonate';
import Balance from './Balance';
import Rewards from './Rewards';
import Epoch from './Epoch';
import WalletConnection from '../WalletConnection';
// import MerkleDistributor from './MerkleDistributor';

const DaoBreakdown = () => {
    return (
        <>
            <WalletConnection title="DAO Breakdown">
                <ul>
                    <li style={{ marginTop: 16 }}>
                        <Balance />
                    </li>
                    <li style={{ marginTop: 16 }}>
                        <ApproveDonate />
                    </li>
                    <li style={{ marginTop: 16 }}>
                        <Rewards />
                    </li>
                    {/* <li style={{ marginTop: 16 }}>
                        <MerkleDistributor />
                    </li> */}
                </ul>
            </WalletConnection>
            <ul>
                <li style={{ marginTop: 16 }}>
                    <Epoch />
                </li>
            </ul>
        </>
    );
}

export default DaoBreakdown;
