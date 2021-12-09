import React from 'react';
import { useBeneficiary } from '@impact-market/utils';

const Beneficiary = props => {
    const { beneficiary, claimCooldown } = useBeneficiary('0xB137bfdB38A022a7B981d9f769DD133Fa0fB2E38') || {};

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
