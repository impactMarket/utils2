import { BigNumber } from 'bignumber.js';

// devides token decimals to get the real value in Bignumber format
export const toBigNumber = (value: any, options?: BigNumber.Config) => {
    try {
        // round down to prevent failling on max
        // TODO: use more decimal places
        BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN, ...options });

        return new BigNumber(value.toString()).dividedBy(new BigNumber(10).pow(18)).toFixed(8);
    } catch (error) {
        return '0';
    }
};

export const toNumber = (value: any, options?: BigNumber.Config) => {
    try {
        const amount = toBigNumber(value, options);

        return parseFloat(amount);
    } catch (error) {
        return 0;
    }
};
