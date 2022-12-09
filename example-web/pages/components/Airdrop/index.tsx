import React from 'react';
import { useAirdropRecurring } from '@impact-market/utils/useAirdropRecurring';
import WalletConnection from '../WalletConnection';

const Airdrop = () => {
    const { claim, amountClaimed, nextClaim, isReady, totalAmount, trancheAmount } = useAirdropRecurring('0xEb0b7fE19c764224e4a6572CC0EA80074489896E');

    console.log('1');
    const handleClaim = () =>
        claim([
            '0x768cc6f944568f656ef10d601c5a65afdb268e83f8ec5c2a8262a33dcd2b376d',
            '0x98b7b5d0041bbdfda680aa1316803a8d869bf77371d8c10b92f6f3afdb8f9cd7'
        ]);

    return (
        <WalletConnection title="Claim">
            <div>Amount claimed {amountClaimed}</div>
            <div>totalAmount {totalAmount}</div>
            <div>trancheAmount {trancheAmount}</div>
            <div>isReady {isReady}</div>
            <div>Next claim {nextClaim.toString()}</div>
            <button onClick={handleClaim}>claim</button>
        </WalletConnection>
    );
};

export default Airdrop;
