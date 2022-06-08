import { Connection } from '@celo/connect';
import { ContractAddresses } from './contractAddress';
import BigNumber from 'bignumber.js';
import type { Contract } from '@ethersproject/contracts';

export async function executeTransaction(
    connection: Connection,
    address: string,
    cusdContract: Contract,
    tx: { data?: string; to?: string }
) {
    // if user has at least 0.01 cUSD, pay with cUSD, othwerwise CELO.
    const hasBalance = new BigNumber((await cusdContract.balanceOf(address)).toString()).dividedBy(10 ** 18).gte('0.01');

    if (!hasBalance) {
        const txResponse = await connection.sendTransaction({
            data: tx.data,
            from: address,
            gasPrice: '500000000',
            to: tx.to,
        });
    
        return await txResponse.waitReceipt();
    }

    const gasLimit = await connection.estimateGas({
        data: tx.data,
        from: address,
        to: tx.to
    });
    let gasPrice = '500000000';

    try {
        gasPrice = await connection.gasPrice();
    } catch(_) {}

    // Gas estimation doesn't currently work properly
    // The gas limit must be padded to increase tx success rate
    // TODO: Investigate more efficient ways to handle this case
    const adjustedGasLimit = gasLimit * 2;

    const txResponse = await connection.sendTransaction({
        data: tx.data,
        feeCurrency: hasBalance ? cusdContract.address : ContractAddresses.get(await connection.chainId())!.CELO,
        from: address,
        gas: adjustedGasLimit,
        gasPrice,
        to: tx.to
    });

    return await txResponse.waitReceipt();
}
