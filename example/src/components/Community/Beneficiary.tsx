import React from 'react';
import { useBeneficiary } from '@impact-market/utils';
import { JsonRpcProvider } from '@ethersproject/providers';

const provider = new JsonRpcProvider("https://alfajores-forno.celo-testnet.org");
const Beneficiary = () => {
    const { beneficiary, claimCooldown, isReady } = useBeneficiary({
        communityAddress: '0x6dcf4B577309aF974216b46817e98833Ad27c0Ab',
        address: '0x7110b4Df915cb92F53Bc01cC9Ab15F51e5DBb52F',
        signer: null,
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
