import React from 'react';
import { useBalance } from '@impact-market/utils';

const Balance = () => {
    const { balance } = useBalance();

    return (
        <>
            <h3>Balance</h3>
            <div style={{ marginTop: 8 }}>
                <ul>
                    {Object.entries(balance).map(([key, value], index) => (
                        <li key={index}>
                            <b>{key}:</b><span style={{ marginLeft: 8 }}>{value}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Balance;
