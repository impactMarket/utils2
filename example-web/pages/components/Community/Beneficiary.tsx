import React from 'react';
import { useBeneficiary } from '@impact-market/utils/useBeneficiary';

const Beneficiary = () => {
    const {
        beneficiary,
        isReady,
        claim
    } = useBeneficiary('0x94876b6bfD2fd838413FB30A654148a5Fd2248b8');
    const { claimCooldown, isClaimable, community, isFinished } = beneficiary;

    console.log('reload useBeneficiary');

    if(!isReady) {
        return <div>Loading</div>;
    }
    if(community.claimAmount === 0) {
        return <div>Not beneficiary</div>;
    }

    return (
        <>
            <h3>Beneficiary info</h3>
            <div style={{ marginTop: 8 }}>
                claimCooldown: {new Date(claimCooldown).toISOString()}
            </div>
            <div style={{ marginTop: 8 }}>
                claimedAmount: {beneficiary.claimedAmount.toString()}
            </div>
            <div style={{ marginTop: 8 }}>
                maxClaim: {community.maxClaim.toString()}
            </div>
            <div style={{ marginTop: 8 }}>
                claimAmount: {community.claimAmount.toString()}
            </div>
            <div style={{ marginTop: 8 }}>
                isClaimable: {isClaimable.toString()}
            </div>
            <div style={{ marginTop: 8 }}>
            isFinished: {isFinished.toString()}
            </div>
            <button onClick={() => claim()}>claim</button>
        </>
    )
}

export default Beneficiary
