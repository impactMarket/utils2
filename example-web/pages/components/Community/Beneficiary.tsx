import React from 'react';
import { useBeneficiary } from '@impact-market/utils/useBeneficiary';

const Beneficiary = () => {
    const {
        beneficiary,
        claimCooldown,
        isClaimable,
        isReady,
        claim,
        community,
        fundsRemainingDays
    } = useBeneficiary('0x13d9d460Bf4bbEE7c3ab53a29c5f23AeC64F8CB6');

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
                communityHasFunds: {community.hasFunds.toString()}
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
                fundsRemainingDays: {fundsRemainingDays.toString()}
            </div>
            <button onClick={() => claim()}>claim</button>
        </>
    )
}

export default Beneficiary
