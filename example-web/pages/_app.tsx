import '@celo/react-celo/lib/styles.css';
import type { AppProps } from 'next/app';
import { Alfajores, CeloProvider, SupportedProviders } from '@celo/react-celo';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <CeloProvider
            network={Alfajores}
            dapp={{
                name: 'My awesome dApp',
                description: 'My awesome description',
                url: 'https://example.com',
                icon: ''
            }}
            connectModal={{
                providersOptions: {
                    additionalWCWallets: [
                        // see https://github.com/WalletConnect/walletconnect-registry/#schema for a schema example
                        {
                            app: {
                                android: 'https://play.google.com/store/apps/details?id=com.impactmarket.mobile',
                                browser: '',
                                ios: 'https://apps.apple.com/app/impactmarket/id1530870911',
                                linux: '',
                                mac: '',
                                windows: '',
                            },
                            chains: ['eip:42220'],
                            description: 'Your future unlocked.',
                            desktop: {
                                native: 'libera://',
                                universal: 'libera://',
                            },
                            homepage: 'https://impactmarket.com/',
                            id: 'libera-wallet',
                            logos: {
                                lg: 'https://dxdwf61ltxjyn.cloudfront.net/eyJidWNrZXQiOiJpbXBhY3RtYXJrZXQtYXBwIiwia2V5IjoiTGliZXJhTG9nby5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSJ9fSwib3V0cHV0Rm9ybWF0IjoianBnIn0=',
                                md: 'https://dxdwf61ltxjyn.cloudfront.net/eyJidWNrZXQiOiJpbXBhY3RtYXJrZXQtYXBwIiwia2V5IjoiTGliZXJhTG9nby5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSJ9fSwib3V0cHV0Rm9ybWF0IjoianBnIn0=',
                                sm: 'https://dxdwf61ltxjyn.cloudfront.net/eyJidWNrZXQiOiJpbXBhY3RtYXJrZXQtYXBwIiwia2V5IjoiTGliZXJhTG9nby5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSJ9fSwib3V0cHV0Rm9ybWF0IjoianBnIn0=',
                            },
                            metadata: {
                                colors: {
                                    primary: '#fff',
                                    secondary: '#2E6AFF',
                                },
                                shortName: 'Libera',
                            },
                            mobile: {
                                native: 'libera://',
                                universal: 'libera://'
                            },
                            name: 'Libera',
                            responsive: {
                                browserFriendly: false,
                                browserOnly: false,
                                mobileFriendly: true,
                                mobileOnly: true,
                            },
                            // IMPORTANT
                            // This is the version of WC. We only support version 1 at the moment.
                            versions: ['1'],
                        },
                    ],
                    // This option hides specific wallets from the default list
                    hideFromDefaults: [
                        SupportedProviders.PrivateKey,
                        SupportedProviders.CeloTerminal,
                        SupportedProviders.CeloWallet,
                        SupportedProviders.CeloDance,
                        SupportedProviders.Injected,
                        SupportedProviders.Ledger,
                        SupportedProviders.Steakwallet,
                    ],
                },
            }}
        >
            <Component {...pageProps} />
        </CeloProvider>
    );
}

export default MyApp;
