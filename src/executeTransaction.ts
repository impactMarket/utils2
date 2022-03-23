import { Connection } from '@celo/connect';

export async function executeTransaction(
    connection: Connection,
    address: string,
    cusdAddress: string,
    tx: { data?: string; to?: string }
) {
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
        feeCurrency: cusdAddress,
        from: address,
        gas: adjustedGasLimit,
        gasPrice,
        to: tx.to
    });

    return await txResponse.waitReceipt();
}
