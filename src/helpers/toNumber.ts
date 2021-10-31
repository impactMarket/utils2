import { BigNumber } from 'bignumber.js';

const toNumber = (value: any) => {
    try {
        const amount = new BigNumber(value.toString())
            .dividedBy(new BigNumber(10).pow(18))
            .toNumber();

        return amount;
    } catch (error) {
        return 0;
    }
};

export default toNumber;
