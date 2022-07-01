import React from 'react';
import { useSignatures } from '@impact-market/utils/useSignatures';
import WalletConnection from '../WalletConnection';

const Signatures = () => {
    const { signMessage } = useSignatures();

    return (
        <WalletConnection title="Signatures">
            <button onClick={() => signMessage('ola')}>signMessage</button>
        </WalletConnection>
    );
};

export default Signatures;
