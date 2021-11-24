# @impact-market/utils

[![NPM](https://img.shields.io/npm/v/@impact-market/utils.svg)](https://www.npmjs.com/package/@impact-market/utils) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add @impact-market/utils
```

## Requirements:
- use `DaoProvider` as child of `ContractKitProvider` in order to hooks to work.

### Available Methods:

- `getWalletsBalance`
- `communityContract` (instantiate a community using the address)

### Available Hooks:

- `useBalance`
- `useContracts`
- `useDAO`
- `useDonationMiner`
- `useEpoch`
- `useRewards`

## Development

Local development is broken into two parts (ideally using two tabs).

First, run rollup to watch your `src/` module and automatically recompile it into `dist/` whenever you make changes.

```bash
npm start # runs rollup with watch flag
```

The second part will be running the `example/` create-react-app that's linked to the local version of your module.

```bash
# (in another tab)
cd example
npm start # runs create-react-app dev server
```

Now, anytime you make a change to your library in `src/` or to the example app's `example/src`, `create-react-app` will live-reload your local dev server so you can iterate on your component in real-time.

## create-react-library

This lib was created using `create-react-library`.
Please check documentetion [here](https://github.com/transitive-bullshit/create-react-library).
