import React from 'react';
import WalletConnection from '../WalletConnection';
import Beneficiary from './Beneficiary';

const Community = () => {
    return (
        <>
            <WalletConnection title="Community">
                <ul>
                    <li style={{ marginTop: 16 }}>
                        <Beneficiary />
                    </li>
                </ul>
            </WalletConnection>
        </>
    );
}

export default Community;
