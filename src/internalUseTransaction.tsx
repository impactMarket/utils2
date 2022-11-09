import { BigNumber } from 'bignumber.js';
import { ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { tokenDecimals, txFeeCELOThreshold, txFeeCStableThreshold } from './config';
import { useContext } from 'react';

export const internalUseTransaction = () => {
    const { connection, address, provider, networkId } = useContext(ImpactProviderContext);

    const executeTransaction = async (tx: { data?: string; from?: string; to?: string }) => {
        // executeTransaction defaults to cStables then CELO to pay fees, on this order of preference
        // if the user doens't have any of this balance, then throws an exception

        if (!address) {
            throw new Error('no valid address connected');
        }

        const { cusd, ceur, celo } = getContracts(provider, networkId);

        // default gas price
        let gasPrice = '500000000';
        let gasLimit = 0;
        let feeTxParams = {};
        let txFeeInCStable: string | undefined;

        // to allow a new asset to pay for fees, add here
        const feesInCStable = [cusd, ceur];
        let feesInCStableIndex = 0;
        let enoughBalanceForTxFee = false;

        // if user has at least the threshold of a given cStable, pay with it
        // othwerwise default to CELO (below).
        do {
            enoughBalanceForTxFee = new BigNumber(
                (await feesInCStable[feesInCStableIndex].balanceOf(address)).toString()
            )
                .dividedBy(tokenDecimals)
                .gte(txFeeCStableThreshold);
            if (enoughBalanceForTxFee) {
                txFeeInCStable = feesInCStable[feesInCStableIndex].address;
                break;
            }
        } while (++feesInCStableIndex < feesInCStable.length);

        if (txFeeInCStable) {
            gasLimit = await connection.estimateGas({
                data: tx.data,
                feeCurrency: txFeeInCStable,
                from: tx.from || address,
                to: tx.to
            });

            // lets get gas price for cusd fee asset
            // ignore if calculation fails
            try {
                gasPrice = await connection.gasPrice(txFeeInCStable);
            } catch (_) {}

            // gas estimation is a little glitchy
            // the gas limit must be padded to increase tx success rate
            // TODO: investigate more efficient ways to handle this case
            gasLimit *= 2;

            // extra needed tx params
            feeTxParams = {
                feeCurrency: txFeeInCStable,
                gas: gasLimit
            };
        } else {
            enoughBalanceForTxFee = new BigNumber((await celo.balanceOf(address)).toString())
                .dividedBy(tokenDecimals)
                .gte(txFeeCELOThreshold);

            if (!enoughBalanceForTxFee) {
                throw new Error('NOT_ENOUGH_FUNDS: not enough funds to submit a transaction.');
            }
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
