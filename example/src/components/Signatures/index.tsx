import React from 'react';
import { useSignatures } from '@impact-market/utils/useSignatures';
import WalletConnection from '../WalletConnection';

const Signatures = () => {
    const { signMessage, signTyped } = useSignatures();

    const handleSignature = () => signMessage('hello');

    const handleSignTyped = () => signTyped().then(console.log).catch(console.error);

    return (
        <WalletConnection title="Signatures">
            <button onClick={handleSignature}>signMessage</button>
            <button onClick={handleSignTyped}>signTyped</button>
        </WalletConnection>
    );
};

export default Signatures;
