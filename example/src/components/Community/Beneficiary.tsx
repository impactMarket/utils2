import React from 'react';
import { useBeneficiary } from '@impact-market/utils';
import { ImpactMarketContext } from '../../context';

const Beneficiary = () => {
    const { address, signer, provider } = React.useContext(ImpactMarketContext);
    const { beneficiary, claimCooldown, isReady } = useBeneficiary({
        communityAddress: '0x6dcf4B577309aF974216b46817e98833Ad27c0Ab',
        address,
        signer,
        provider,
    });

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
        </>
    )
}

export default Beneficiary
