import React, { useState } from 'react'
import Intro from './components/Intro';
import Wallets from './components/Wallets';
import DaoBreakdown from './components/DaoBreakdown';

const components = [
    { label: 'Get wallets balance', component: Wallets },
    { label: 'DAO Breakdown', component: DaoBreakdown },
]

const options = components.map(({ label }) => label);

const initialOption = options[1];

const App = () => {
    const [selectedOption, setSelectedOption] = useState<any>(initialOption);

    const Component = components.find(({ label }) => label === selectedOption)?.component;

    return (
        <>
            <Intro handleChange={setSelectedOption} initialOption={initialOption} options={options} />
            {!!Component && <Component />}
        </>
    )
}

export default App
