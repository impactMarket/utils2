import React from 'react';
import { useCaskFi } from '@impact-market/utils/useCaskFi';
import WalletConnection from '../WalletConnection';

const CaskFi = () => {
    const { donate } = useCaskFi();

    return (
        <WalletConnection title="Signatures">
            <button onClick={donate}>Donate</button>
        </WalletConnection>
    );
};

export default CaskFi;
