import React from 'react';
import WalletConnection from '../WalletConnection';
import Beneficiary from './Beneficiary';
import Manager from './Manager';

const Community = () => {
    return (
        <>
            <WalletConnection title="Community">
                <ul>
                    <li style={{ marginTop: 16 }}>
                        <Beneficiary />
                    </li>
                    <li style={{ marginTop: 16 }}>
                        <Manager />
                    </li>
                </ul>
            </WalletConnection>
        </>
    );
}

export default Community;
