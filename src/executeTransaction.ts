import { Connection } from "@celo/connect";

export async function executeTransaction(
    connection: Connection,
    address: string,
    cusdAddress: string,
    tx: { data?:string, to?:string },
) {
    const gasLimit = await connection.estimateGas({
        data: tx.data,
        to: tx.to,
        from: address
    });
    const gasPrice = await connection.gasPrice();

    // Gas estimation doesn't currently work properly
    // The gas limit must be padded to increase tx success rate
    // TODO: Investigate more efficient ways to handle this case
    const adjustedGasLimit = gasLimit * 2;

    const txResponse = await connection.sendTransaction({
        data: tx.data,
        to: tx.to,
        from: address,
        feeCurrency: cusdAddress,
        gas: adjustedGasLimit,
        gasPrice
    });
    return await txResponse.waitReceipt();
}