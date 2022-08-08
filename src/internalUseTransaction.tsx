import { BigNumber } from 'bignumber.js';
import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { useContext } from 'react';

export const internalUseTransaction = () => {
    const { connection, address, provider } = useContext(ImpactProviderContext);

    const executeTransaction = async (tx: { data?: string; from?: string; to?: string }) => {
        if (!address) {
            return;
        }

        const { cusd } = await getContracts(provider);

        // if user has at least 0.01 cUSD, pay with cUSD, othwerwise default.
        const userCUSDBalanace = new BigNumber((await cusd.balanceOf(address)).toString());
        const txFeeInCUSD = userCUSDBalanace.dividedBy(10 ** 18).gte('0.01');

        // default gas price
        let gasPrice = '500000000';
        let gasLimit = 0;
        let feeTxParams = {};

        // if enough cusd balance, send do extra calculations
        if (txFeeInCUSD) {
            gasLimit = await connection.estimateGas({
                data: tx.data,
                feeCurrency: cusd.address,
                from: tx.from || address,
                to: tx.to
            });

            // lets get gas price for cusd fee asset
            // ignore if calculation fails
            try {
                gasPrice = await connection.gasPrice(cusd.address);
            } catch (_) {}

            // gas estimation is a little glitchy
            // the gas limit must be padded to increase tx success rate
            // TODO: investigate more efficient ways to handle this case
            gasLimit *= 2;

            // extra needed tx params
            feeTxParams = {
                feeCurrency: cusd.address,
                gas: gasLimit
            };
        }

        const txResponse = await connection.sendTransaction({
            data: tx.data,
            from: tx.from || address,
            gasPrice,
            to: tx.to,
            ...feeTxParams
        });

        return await txResponse.waitReceipt();
    };

    return executeTransaction;
};
