# @impact-market/utils

[![NPM](https://img.shields.io/npm/v/@impact-market/utils.svg)](https://www.npmjs.com/package/@impact-market/utils) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add @impact-market/utils
```

### Requirements:
- use `ImpactProvider` in order for hooks to work.

## Usage:

See docs for further details. Use `yarn docs` to generate docs and open index.html at docs folder.

An example using Next.js, web3modal and wagmi

```javascript
// _app.tsx
import type { AppProps } from 'next/app';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { celo } from '@wagmi/chains';

const projectId = '<walletconnect-project-id>';

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
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient}/>
        </>
    );
}

export default MyApp;
```

```javascript
// index.tsx
import React from 'react';
import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import { useAccount, useNetwork, useSigner } from 'wagmi';

function App() {
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { chain } = useNetwork();

    return (
        <ImpactProvider
            jsonRpc={chain?.rpcUrls.public.http[0] ||  'https://alfajores-forno.celo-testnet.org'}
            signer={signer ?? null}
            address={address ?? null}
            networkId={chain?.id || 44787}
        >
            {/** something */}
        </ImpactProvider>
    );
}

export default App;
```

If you use this within react-native, please install and add `import '@ethersproject/shims';` at App.{jsx,tsx}.
It is required by ethers.

## Development

Local development is broken into two parts (ideally using two tabs).

First, run typescript compiler to watch your `src/` module and automatically recompile it whenever you make changes.

```bash
yarn start # runs compiler with watch flag
```

The second part will be running the `example/` create-react-app that's linked to the local version of your module.

```bash
# (in another tab)
cd example-web
yarn dev
```

Now, anytime you make a change to your library in `src/` or to the example app's `example-web/src`, the wxample app will live-reload your local dev server so you can iterate on your component in real-time.

## create-react-library

This lib was created using `create-react-library`.
Please check documentetion [here](https://github.com/transitive-bullshit/create-react-library).
