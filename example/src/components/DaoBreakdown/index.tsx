import '@celo-tools/use-contractkit/lib/styles.css';
import { ContractKitProvider, Alfajores, useContractKit } from '@celo-tools/use-contractkit';
import React from 'react';
import { DaoProvider } from '@impact-market/utils';
import ApproveDonate from './ApproveDonate';
import Balance from './Balance';
import ClaimableRewards from './ClaimableRewards';
import Epoch from './Epoch';
import EstimatedRewards from './EstimatedRewards';

const DaoBreakdownContent = () => {
    const { address, connect, destroy, initialised } = useContractKit();

    if (!initialised) {
        return <div>loading...</div>
    }

    return (
        <div>
            <h2>Dao Breakdown</h2>
            <div style={{ marginBottom: 32, marginTop: 8 }}>
                {!address ? (
                    <button onClick={connect}>Connect wallet</button>
                ) : (
                    <button onClick={destroy}>Disconnect wallet</button>
                )}
            </div>
            {address && (
                <ul>
                    <li>
                        <h3>Address</h3>
                        <span>{address}</span>
                    </li>
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
                </ul>
            )}
        </div>
    )
}


const DaoBreakdown = props => {
    return (
        <ContractKitProvider
            network={Alfajores}
            dapp={{
                name: 'My awesome dApp',
                description: 'My awesome description',
                url: 'https://example.com',
                icon: 'https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/044/041/datas/original.jpg'
            }}
        >
            <DaoProvider>
                <DaoBreakdownContent />
            </DaoProvider>
        </ContractKitProvider>
    );
}

export default DaoBreakdown;
