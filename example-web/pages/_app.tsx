import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { metaMaskWallet, omniWallet, walletConnectWallet, ledgerWallet } from '@rainbow-me/rainbowkit/wallets';
import { Valora, CeloWallet, CeloDance } from '@celo/rainbowkit-celo/wallets';
import { Alfajores, Celo } from '@celo/rainbowkit-celo/chains';

const { chains, provider } = configureChains(
    [Alfajores, Celo],
    [jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default.http[0] }) })]
);

const connectors = connectorsForWallets([
    {
        groupName: 'Recommended with CELO',
        wallets: [
            Valora({ chains }),
            CeloWallet({ chains }),
            CeloDance({ chains }),
            metaMaskWallet({ chains }),
            omniWallet({ chains }),
            walletConnectWallet({ chains }),
            ledgerWallet({ chains })
        ]
    }
]);

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default MyApp;
