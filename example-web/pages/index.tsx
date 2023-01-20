import React, { useEffect, useState } from 'react';
import Intro from './components/Intro';
import WalletsBalance from './components/WalletsBalance';
import DaoBreakdown from './components/DaoBreakdown';
import DaoHooks from './components/DaoHooks';
import { Alfajores, useCelo, useProviderOrSigner } from '@celo/react-celo';
import { JsonRpcProvider } from '@ethersproject/providers';
import PACTMetrics from './components/PACTMetrics';
import Community from './components/Community';
import Staking from './components/Staking';
import ImpactMarketCouncil from './components/ImpactMarketCouncil';
import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import Signatures from './components/Signatures';
import Airdrop from './components/Airdrop';
import DepositRedirect from './components/DepositRedirect';
import LearnAndEarn from './components/LearnAndEarn';

const components = [
    { label: 'Get wallets balance', component: WalletsBalance },
    { label: 'DAO Breakdown', component: DaoBreakdown },
    { label: 'DAO Hooks', component: DaoHooks },
    { label: 'Community', component: Community },
    { label: 'PACT Metrics', component: PACTMetrics },
    { label: 'Staking', component: Staking },
    { label: 'ImpactMarketCouncil', component: ImpactMarketCouncil },
    { label: 'Signatures', component: Signatures },
    { label: 'Airdrop', component: Airdrop },
    { label: 'DepositRedirect', component: DepositRedirect },
    { label: 'LearnAndEarn', component: LearnAndEarn }
];

const options = components.map(({ label }) => label);

const initialOption = options[9];

const network = Alfajores;

const provider = new JsonRpcProvider(network.rpcUrl);
function App() {
    const signer = useProviderOrSigner();
    // const provider = useProvider();
    const { address, initialised, network: walletNetwork, kit } = useCelo();
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
            <ImpactProvider
                jsonRpc={network.rpcUrl}
                connection={kit.connection}
                address={isSameNetwork && address ? address : null}
                networkId={providerNetworkChainId}
            >
                <Intro handleChange={setSelectedOption} initialOption={initialOption} options={options} />
                {!!Component && <Component />}
            </ImpactProvider>
        </>
    );
}

export default App;
