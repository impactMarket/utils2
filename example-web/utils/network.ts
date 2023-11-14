import { celoAlfajores, celo } from '@wagmi/chains';
import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { walletConnectProvider } from '@web3modal/wagmi';

export const projectId = 'e14be5c27cfd796596686bdc6876e836';

export const metadata = {
    name: 'impactMarket utils',
    description: 'impactMarket utils Example',
    url: 'https://utils-flame.vercel.app',
    icons: ['https://avatars.githubusercontent.com/u/42247406']
};

export const { chains, publicClient } = configureChains(
    [celoAlfajores, celo],
    [walletConnectProvider({ projectId }), publicProvider()]
);

export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
        new InjectedConnector({ chains, options: { shimDisconnect: true } })
    ],
    publicClient
});