import '@celo-tools/use-contractkit/lib/styles.css';
import React, { useState } from 'react'
import Intro from './components/Intro';
import WalletsBalance from './components/WalletsBalance';
import DaoBreakdown from './components/DaoBreakdown';
import DaoHooks from './components/DaoHooks';
import { ContractKitProvider, Alfajores } from '@celo-tools/use-contractkit';
import { DaoProvider } from '@impact-market/utils';

const components = [
    { label: 'Get wallets balance', component: WalletsBalance },
    { label: 'DAO Breakdown', component: DaoBreakdown },
    { label: 'DAO Hooks', component: DaoHooks },
]

const options = components.map(({ label }) => label);

const initialOption = options[2];

const App = () => {
    const [selectedOption, setSelectedOption] = useState<any>(initialOption);

    const Component = components.find(({ label }) => label === selectedOption)?.component;

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
                <Intro handleChange={setSelectedOption} initialOption={initialOption} options={options} />
                {!!Component && <Component />}
            </DaoProvider>
      </ContractKitProvider>
    )
}

export default App
