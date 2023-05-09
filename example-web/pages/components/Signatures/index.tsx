import React from 'react';
import { useSignatures } from '@impact-market/utils/useSignatures';
import WalletConnection from '../WalletConnection';

const Signatures = () => {
    const { signMessage, signTypedData } = useSignatures();

    const handleSignature = () => signMessage('hello').then(console.log).catch(console.error);

    const handleSignTypedData = () => signTypedData('Proving my identity').then(console.log).catch(console.error);

    return (
        <WalletConnection title="Signatures">
            <button onClick={handleSignature}>signMessage</button>
            <button onClick={handleSignTypedData}>signTypedData</button>
        </WalletConnection>
    );
};

export default Signatures;
