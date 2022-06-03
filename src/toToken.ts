import BigNumber from 'bignumber.js';

export const toToken = (value: BigNumber | string | number, options?: BigNumber.Config) => {
    BigNumber.config({ EXPONENTIAL_AT: 29, ...options });

    return new BigNumber(value.toString()).multipliedBy(new BigNumber(10).pow(18)).toString();
};
