import '@celo-tools/use-contractkit/lib/styles.css';
import React, { useEffect, useState } from 'react'
import Intro from './components/Intro';
import WalletsBalance from './components/WalletsBalance';
import DaoBreakdown from './components/DaoBreakdown';
import DaoHooks from './components/DaoHooks';
import { ContractKitProvider, Alfajores, useContractKit, useConnectedSigner } from '@celo-tools/use-contractkit';
import { ImpactMarketProvider } from '@impact-market/utils';
import { JsonRpcProvider } from '@ethersproject/providers';
import PACTMetrics from './components/PACTMetrics';

const components = [
    { label: 'Get wallets balance', component: WalletsBalance },
    { label: 'DAO Breakdown', component: DaoBreakdown },
    { label: 'DAO Hooks', component: DaoHooks },
    { label: 'PACT Metrics', component: PACTMetrics },
]

const options = components.map(({ label }) => label);

const initialOption = options[3];

const network = Alfajores;

function App() {
    const provider = new JsonRpcProvider(network.rpcUrl);
    const signer = useConnectedSigner();
    const { address, initialised, network: walletNetwork } = useContractKit();
    const [selectedOption, setSelectedOption] = useState<string>(initialOption);
    const [providerNetworkChainId, setProviderNetworkChainId] = useState<number | undefined>();

    const Component = components.find(({ label }) => label === selectedOption)?.component;

    useEffect(() => {
        const setChainId = async () => {
            const network = await provider?.getNetwork();

            if (providerNetworkChainId !== network?.chainId) {
                setProviderNetworkChainId(network?.chainId)
            }
        }
        if (provider) {
            setChainId();
        }
    }, [provider, providerNetworkChainId])

    if (!initialised || !providerNetworkChainId) {
        return <div>Loading...</div>
    }

    const isSameNetwork = walletNetwork?.chainId === providerNetworkChainId

    if (walletNetwork?.chainId && !isSameNetwork) {
        return <div>The app and your wallet are in different networks!</div>
    }

    console.log(walletNetwork)

    return (
        <>
            <ImpactMarketProvider address={isSameNetwork ? address : null} provider={provider} signer={signer}>
                <Intro handleChange={setSelectedOption} initialOption={initialOption} options={options} />
                {!!Component && <Component />}
            </ImpactMarketProvider>
        </>
    )
}

function WrappedApp() {
    return (
        <ContractKitProvider
            network={network}
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
