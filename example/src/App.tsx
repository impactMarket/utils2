import '@celo-tools/use-contractkit/lib/styles.css';
import React, { useEffect, useState } from 'react'
import Intro from './components/Intro';
import WalletsBalance from './components/WalletsBalance';
import DaoBreakdown from './components/DaoBreakdown';
import DaoHooks from './components/DaoHooks';
import { ContractKitProvider, Alfajores, useContractKit, useProvider, useConnectedSigner } from '@celo-tools/use-contractkit';
import { ImpactMarketProvider } from '@impact-market/utils';
import { JsonRpcProvider } from '@ethersproject/providers';

const components = [
    { label: 'Get wallets balance', component: WalletsBalance },
    { label: 'DAO Breakdown', component: DaoBreakdown },
    { label: 'DAO Hooks', component: DaoHooks },
]

const options = components.map(({ label }) => label);

const initialOption = options[1];

function App() {
    const provider = new JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
    const walletProvider = useProvider();
    const signer = useConnectedSigner();
    const { address } = useContractKit();
    const [selectedOption, setSelectedOption] = useState<any>(initialOption);
    const [isInDifferentNetwork, setIsInDifferentNetwork] = useState(false);

    const Component = components.find(({ label }) => label === selectedOption)?.component;

    useEffect(() => {
        const verifyNetwork = async () => {
            const netowrk = await provider?.getNetwork();
            const walletNetowrk = await walletProvider?.getNetwork();
            setIsInDifferentNetwork(netowrk.chainId !== walletNetowrk.chainId);
        }
        if (walletProvider) {
            verifyNetwork();
        }
    }, [walletProvider, provider])

    return (
        <>
            {isInDifferentNetwork && (<div>You are on the wrong network!</div>)}
            <ImpactMarketProvider address={address} provider={provider} signer={signer}>
                <Intro handleChange={setSelectedOption} initialOption={initialOption} options={options} />
                {!!Component && <Component />}
            </ImpactMarketProvider>
        </>
    )
}

function WrappedApp() {
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
            <App />
        </ContractKitProvider>
    )
}

export default WrappedApp
