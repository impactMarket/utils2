import React from 'react';
import { useCUSDBalance, usePACTBalance } from '@impact-market/utils/useBalance';
import { ImpactMarketContext } from '../../context';

const Balance = () => {
    const { address, provider } = React.useContext(ImpactMarketContext);
    const { balance: balanceCUSD } = useCUSDBalance({ address, provider });
    const { balance: balancePACT } = usePACTBalance({ address, provider });

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
