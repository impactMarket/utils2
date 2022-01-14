import React from 'react';
import { useBeneficiary } from '@impact-market/utils';

const Beneficiary = () => {
    const {
        beneficiary,
        claimCooldown,
        isClaimable,
        isReady,
        claim
    } = useBeneficiary('0x6dcf4B577309aF974216b46817e98833Ad27c0Ab');

    if(!isReady) {
        return <div>Loading</div>;
    }

    return (
        <>
            <h3>Beneficiary info</h3>
            <div style={{ marginTop: 8 }}>
                claimCooldown: {claimCooldown.toISOString()}
            </div>
            <div style={{ marginTop: 8 }}>
                claimedAmount: {beneficiary.claimedAmount.toString()}
            </div>
            <div style={{ marginTop: 8 }}>
                lastClaim: {beneficiary.lastClaim.toString()}
            </div>
            <div style={{ marginTop: 8 }}>
                isClaimable: {isClaimable.toString()}
            </div>
            <button onClick={() => claim()}>claim</button>
        </>
    )
}

export default Beneficiary
