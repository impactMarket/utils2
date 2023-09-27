import type { AppProps } from 'next/app';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { celoAlfajores } from '@wagmi/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { walletConnectProvider } from '@web3modal/wagmi';

const projectId = 'e14be5c27cfd796596686bdc6876e836';

const metadata = {
    name: 'impactMarket utils',
    description: 'impactMarket utils Example',
    url: 'https://utils-flame.vercel.app',
    icons: ['https://avatars.githubusercontent.com/u/42247406']
};

const { chains, publicClient } = configureChains(
    [celoAlfajores],
    [walletConnectProvider({ projectId }), publicProvider()]
);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
        new InjectedConnector({ chains, options: { shimDisconnect: true } })
    ],
    publicClient
});

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
    defaultChain: celoAlfajores
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
