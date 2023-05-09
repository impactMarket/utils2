import React, { useState } from 'react';
import Intro from './components/Intro';
import WalletsBalance from './components/WalletsBalance';
import DaoBreakdown from './components/DaoBreakdown';
import DaoHooks from './components/DaoHooks';
import PACTMetrics from './components/PACTMetrics';
import Community from './components/Community';
import Staking from './components/Staking';
import ImpactMarketCouncil from './components/ImpactMarketCouncil';
import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import Signatures from './components/Signatures';
import Airdrop from './components/Airdrop';
import DepositRedirect from './components/DepositRedirect';
import LearnAndEarn from './components/LearnAndEarn';
import MicroCredit from './components/MicroCredit';
import { useAccount, useNetwork, useSigner } from 'wagmi';

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
    { label: 'LearnAndEarn', component: LearnAndEarn },
    { label: 'MicroCredit', component: MicroCredit }
];

const options = components.map(({ label }) => label);

const initialOption = options[1];

function App() {
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { chain } = useNetwork();
    const [selectedOption, setSelectedOption] = useState<string>(initialOption);

    const Component = components.find(({ label }) => label === selectedOption)?.component;

    return (
        <ImpactProvider
            jsonRpc={chain?.rpcUrls.public.http[0] ||  'https://alfajores-forno.celo-testnet.org'}
            signer={signer ?? null}
            address={address ?? null}
            networkId={chain?.id || 44787}
        >
            <Intro handleChange={setSelectedOption} initialOption={initialOption} options={options} />
            {!!Component && <Component />}
        </ImpactProvider>
    );
}

export default App;
