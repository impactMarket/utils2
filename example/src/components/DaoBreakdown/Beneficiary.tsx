import React from 'react';
import { useBeneficiary } from '@impact-market/utils';

const Beneficiary = props => {
    const { beneficiary, claimCooldown } = useBeneficiary('0x6dcf4B577309aF974216b46817e98833Ad27c0Ab') || {};

    return (
        <>
            <h3>Beneficiary info</h3>
            <div style={{ marginTop: 8 }}>
                {claimCooldown.toISOString()}
            </div>
            <div style={{ marginTop: 8 }}>
                {beneficiary.claimedAmount.toString()}
            </div>
        </>
    )
}

export default Beneficiary
