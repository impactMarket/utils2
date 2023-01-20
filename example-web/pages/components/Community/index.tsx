import React from 'react';
import WalletConnection from '../WalletConnection';
import Beneficiary from './Beneficiary';
import Manager from './Manager';
import Ambassador from './Ambassador';

const Community = () => {
    return (
        <WalletConnection title="Community">
            <ul>
                <li style={{ marginTop: 16 }}>
                    <Beneficiary />
                </li>
                <li style={{ marginTop: 16 }}>
                    <Manager />
                </li>
                <li style={{ marginTop: 16 }}>
                    <Ambassador />
                </li>
            </ul>
        </WalletConnection>
    );
};

export default Community;
