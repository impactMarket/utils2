import { BigNumber } from 'bignumber.js';

export const toNumber = (value: any, options?: BigNumber.Config) => {
    try {
        // round down to prevent failling on max
        // TODO: use more decimal places
        BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN, ...options });
        const amount = new BigNumber(value.toString()).dividedBy(new BigNumber(10).pow(18)).toFixed(8);

        return parseFloat(amount);
    } catch (error) {
        return 0;
    }
};
