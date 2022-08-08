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

If you use this within react native, please install and add `import '@ethersproject/shims';` at App.{jsx,tsx}.
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
cd example
yarn start # runs create-react-app dev server
```

Now, anytime you make a change to your library in `src/` or to the example app's `example/src`, `create-react-app` will live-reload your local dev server so you can iterate on your component in real-time.

## create-react-library

This lib was created using `create-react-library`.
Please check documentetion [here](https://github.com/transitive-bullshit/create-react-library).
