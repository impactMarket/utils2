import React from 'react';
import { useMerkleDistributor } from '@impact-market/utils';
import merkleTree from './merkleTree.json'

const Balance = () => {
    const { hasClaim, amountToClaim, claim } = useMerkleDistributor(merkleTree);

    return (
        <>
            <h3>Merkle Distributor</h3>
            <div style={{ marginTop: 8 }}>
                {hasClaim ? <button onClick={claim} >{amountToClaim} claim</button> : 'No claim available'}
            </div>
        </>
    )
}

export default Balance;
