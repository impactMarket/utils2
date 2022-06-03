import '@celo-tools/use-contractkit/lib/styles.css';
import React, { useEffect, useState } from 'react';
import Intro from './components/Intro';
import WalletsBalance from './components/WalletsBalance';
import DaoBreakdown from './components/DaoBreakdown';
import DaoHooks from './components/DaoHooks';
import { ContractKitProvider, Alfajores, useContractKit, useProviderOrSigner } from '@celo-tools/use-contractkit';
import { JsonRpcProvider } from '@ethersproject/providers';
import PACTMetrics from './components/PACTMetrics';
import Community from './components/Community';
import Staking from './components/Staking';
import UBICommittee from './components/UBICommittee';
import { ImpactProvider } from '@impact-market/utils/ImpactProvider';

const components = [
    { label: 'Get wallets balance', component: WalletsBalance },
    { label: 'DAO Breakdown', component: DaoBreakdown },
    { label: 'DAO Hooks', component: DaoHooks },
    { label: 'Community', component: Community },
    { label: 'PACT Metrics', component: PACTMetrics },
    { label: 'Staking', component: Staking },
    { label: 'UBICommittee', component: UBICommittee }
];

const options = components.map(({ label }) => label);

const initialOption = options[5];

const network = Alfajores;

const provider = new JsonRpcProvider(network.rpcUrl);
function App() {
    const signer = useProviderOrSigner();
    const { address, initialised, network: walletNetwork, kit } = useContractKit();
    const [selectedOption, setSelectedOption] = useState<string>(initialOption);
    const [providerNetworkChainId, setProviderNetworkChainId] = useState<number | undefined>();

    const Component = components.find(({ label }) => label === selectedOption)?.component;

    useEffect(() => {
        const setChainId = async () => {
            // do not request the network, if information exists
            let chainId = provider.network?.chainId;
            if (!chainId) {
                const _network = await provider?.getNetwork();
                chainId = _network?.chainId;
            }

            if (providerNetworkChainId !== chainId) {
                setProviderNetworkChainId(chainId);
            }
        };
        if (!providerNetworkChainId) {
            setChainId();
        }
    }, [providerNetworkChainId]);

    if (!initialised || !providerNetworkChainId) {
        return <div>Loading...</div>;
    }

    const isSameNetwork = walletNetwork?.chainId === providerNetworkChainId;

    if (walletNetwork?.chainId && !isSameNetwork) {
        return <div>The app and your wallet are in different networks!</div>;
    }

    console.log(signer);

    return (
        <>
            <ImpactProvider jsonRpc={network.rpcUrl} web3={kit.web3} address={isSameNetwork ? address : null}>
                <Intro handleChange={setSelectedOption} initialOption={initialOption} options={options} />
                {!!Component && <Component />}
            </ImpactProvider>
        </>
    );
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
    );
}

export default WrappedApp;
