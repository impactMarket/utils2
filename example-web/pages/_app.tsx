import type { AppProps } from 'next/app';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { celo } from '@wagmi/chains';

const projectId = 'e14be5c27cfd796596686bdc6876e836';

const { chains, provider } = configureChains(
    [celo],
    [jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default.http[0] }) })]
);

const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 2, chains }),
    provider
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <WagmiConfig client={wagmiClient}>
                <Component {...pageProps} />
            </WagmiConfig>
            <Web3Modal
                projectId={projectId}
                ethereumClient={ethereumClient}
                explorerRecommendedWalletIds={[
                    // metamask
                    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
                    // valora
                    'd01c7758d741b363e637a817a09bcf579feae4db9f5bb16f599fdd1f66e2f974'
                ]}
                mobileWallets={[
                    {
                        id: 'libera',
                        name: 'libera',
                        links: {
                            native: 'libera://',
                            universal: 'https://liberawallet.com'
                        }
                    }
                ]}
                walletImages={{
                    libera: 'https://play.google.com/store/apps/details?id=com.impactmarket.mobile&hl=pt&gl=DZ'
                }}
            />
        </>
    );
}

export default MyApp;
