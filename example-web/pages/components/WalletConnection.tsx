import { useCelo } from '@celo/react-celo';
import { Web3Button } from '@web3modal/react'
import React from 'react';
import { useAccount } from 'wagmi';

const WalletConnection = (props: { children: any; title?: string }) => {
    const { children, title } = props;
    const { address } = useAccount();

    // if (!initialised) {
    //     return <div>loading...</div>;
    // }

    return (
        <div>
            {!!title && <h2>{title}</h2>}
            <div style={{ marginBottom: 32, marginTop: title ? 8 : 0 }}>
                <Web3Button />
            </div>
            {address && (
                <>
                    <div>
                        <h3>Address</h3>
                        <span>{address}</span>
                    </div>
                    <div style={{ marginTop: 32 }}>{children}</div>
                </>
            )}
        </div>
    );
};

export default WalletConnection;
