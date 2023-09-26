import React from 'react';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

const WalletConnection = (props: { children: any; title?: string }) => {
    const { children, title } = props;
    const { address } = useAccount();
    const { open } = useWeb3Modal();

    // if (!initialised) {
    //     return <div>loading...</div>;
    // }

    return (
        <div>
            {!!title && <h2>{title}</h2>}
            <div style={{ marginBottom: 32, marginTop: title ? 8 : 0 }}>
                <button onClick={() => open()}>Open Connect Modal</button>
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
