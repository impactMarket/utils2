import React from 'react';
import WalletConnection from '../WalletConnection';
import { useDepositRedirect } from '@impact-market/utils/useDepositRedirect';

function DepositRedirect() {
    const { deposit } = useDepositRedirect();
    const [amount, setAmount] = React.useState('');

    const handleDeposit = async () => {
        await deposit('0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', amount);
    };

    return (
        <>
            <input
                type="text"
                placeholder="token amount"
                value={amount}
                onChange={e => setAmount(e.currentTarget.value)}
            />
            <button onClick={handleDeposit}>Deposit</button>
        </>
    );
}

export default function Wrap() {
    return (
        <WalletConnection title="DepositRedirect">
            <DepositRedirect />
        </WalletConnection>
    );
}
