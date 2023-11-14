import type { AppProps } from 'next/app';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { celoAlfajores, celo } from '@wagmi/chains';
import { WagmiConfig } from 'wagmi';
import { chains, projectId, wagmiConfig } from '../utils/network';

createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    featuredWalletIds: [
        // libera
        'b7cd38c9393f14b8031bc10bc0613895d0d092c33d836547faf8a9b782f6cbcc',
        // valora
        'd01c7758d741b363e637a817a09bcf579feae4db9f5bb16f599fdd1f66e2f974'
    ],
    themeMode: 'light',
    defaultChain: process.env.NEXT_PUBLIC_DEFAULT_MAINNET === 'true' ? celo : celoAlfajores
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <WagmiConfig config={wagmiConfig}>
                <Component {...pageProps} />
            </WagmiConfig>
        </>
    );
}

export default MyApp;
