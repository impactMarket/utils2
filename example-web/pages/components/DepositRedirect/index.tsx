import React from 'react';
import WalletConnection from '../WalletConnection';
import { useDepositRedirect } from '@impact-market/utils/useDepositRedirect';
import { useCelo } from '@celo/react-celo';

function DepositRedirect() {
    const { address } = useCelo();
    const { approve, deposit, userDeposits, donateInterest } = useDepositRedirect();
    const [amount, setAmount] = React.useState('');

    const handleDeposit = async () => {
        const token = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1';
        await approve(token, amount);
        await deposit(token, amount);
    };

    const handleDonateInterest = async (token: string) => {
        await donateInterest(address!, token)
    }

    return (
        <>
            <h3>Details</h3>
            <p>Click on list item to redirect interest</p>
            <ul>
                {userDeposits.map(({ asset, deposited, interest, availableInterest }) => (
                    <li key={asset} onClick={() => handleDonateInterest(asset)}>
                        Asset: {asset} | Deposited: {deposited} | Interest Donated: {interest} | Available Interest: {availableInterest}
                    </li>
                ))}
            </ul>
            <h3>Deposit</h3>
            <p>(Alfajores) For now, only token is 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1</p>
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
