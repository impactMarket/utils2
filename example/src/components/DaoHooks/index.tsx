import React from 'react';
import WalletConnection from '../WalletConnection';
import AddCommunity from './AddCommunity';
import VotingPower from './VotingPower';

const DaoHooks = props => {
    return (
        <WalletConnection title="DAO Hooks">
            <ul>
                <li style={{ marginTop: 16 }}>
                    <AddCommunity />
                    <VotingPower />
                </li>
            </ul>
        </WalletConnection>
    );
}

export default DaoHooks;
