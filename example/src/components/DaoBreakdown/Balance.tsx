import React from 'react';
import { useCUSDBalance, usePACTBalance } from '@impact-market/utils';

const Balance = () => {
    const { balance: balanceCUSD } = useCUSDBalance();
    const { balance: balancePACT } = usePACTBalance();

    if (!balanceCUSD || !balancePACT) {
        return null;
    }
    return (
        <>
            <h3>Balance</h3>
            <div style={{ marginTop: 8 }}>
                <ul>
                    <li key='balanceCUSD'>
                        <b>balanceCUSD:</b><span style={{ marginLeft: 8 }}>{balanceCUSD}</span>
                    </li>
                    <li key='balancePACT'>
                        <b>balancePACT:</b><span style={{ marginLeft: 8 }}>{balancePACT}</span>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Balance;
