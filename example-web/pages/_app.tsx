import '@celo/react-celo/lib/styles.css';
import type { AppProps } from 'next/app';
import { Alfajores, CeloProvider } from '@celo/react-celo';

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
        >
            <Component {...pageProps} />
        </CeloProvider>
    );
}

export default MyApp;
