import BigNumber from 'bignumber.js';

export const toToken = (value: BigNumber | string | number) =>
    new BigNumber(value.toString()).multipliedBy(10 ** 18).toString();
