import { useCelo } from '@celo/react-celo';
import React from 'react';

const WalletConnection = (props: { children: any; title?: string }) => {
    const { children, title } = props;
    const { address, connect, destroy, initialised } = useCelo();

    if (!initialised) {
        return <div>loading...</div>;
    }

    return (
        <div>
            {!!title && <h2>{title}</h2>}
            <div style={{ marginBottom: 32, marginTop: title ? 8 : 0 }}>
                {!address ? (
                    <button onClick={connect}>Connect wallet</button>
                ) : (
                    <button onClick={destroy}>Disconnect wallet</button>
                )}
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
