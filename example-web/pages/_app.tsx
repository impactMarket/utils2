import type { AppProps } from 'next/app';
import { WagmiConfig } from 'wagmi';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { celoAlfajores } from '@wagmi/chains';

const chains = [celoAlfajores];
const projectId = 'e14be5c27cfd796596686bdc6876e836';


const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    featuredWalletIds: [
        // libera
        'b7cd38c9393f14b8031bc10bc0613895d0d092c33d836547faf8a9b782f6cbcc',
        // valora
        'd01c7758d741b363e637a817a09bcf579feae4db9f5bb16f599fdd1f66e2f974',
        // metamask
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
    ],
    themeMode: 'light',
    defaultChain: celoAlfajores,
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
