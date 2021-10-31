import React from 'react';
import { useEpoch } from '@impact-market/utils';

const Epoch = props => {
    const { epoch } = useEpoch() || {};

    return (
        <>
            <h3>Epoch info</h3>
            <div style={{ marginTop: 8 }}>
                <ul>
                    {!!epoch && Object.entries(epoch).map(([key, value], index) => (
                        <li key={index}>
                            <b>{key}:</b><span style={{ marginLeft: 8 }}>{value}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Epoch
