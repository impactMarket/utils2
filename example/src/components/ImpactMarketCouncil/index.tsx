import React from 'react';
import WalletConnection from '../WalletConnection';
import AddCommunity from './AddCommunity';
import BuildingOperationsBlocks from './BuildingOperationBlocks';
import ListProposals from './ListProposals';

const DaoHooks = () => {
    return (
        <WalletConnection title="ImpactMarketCouncil">
            <ul>
                <li style={{ marginTop: 16 }}>
                    <AddCommunity />
                    <ListProposals />
                    <BuildingOperationsBlocks />
                </li>
            </ul>
        </WalletConnection>
    );
};

export default DaoHooks;
