import { Interface } from '@ethersproject/abi';
import { TransactionReceipt } from '@ethersproject/providers';

export const filterEvent = (event: string, eventName: string, txResponse: TransactionReceipt) => {
    if (txResponse.logs === undefined) {
        throw new Error('no events');
    }
    const iface = new Interface([event]);
    const eventLog = txResponse.logs.find(e => {
        try {
            return iface.parseLog(e).name === eventName;
        } catch (_) {
            return false;
        }
    });

    if (!eventLog) {
        throw new Error(`${eventName} not found in transaction`);
    }

    return iface.parseLog(eventLog);
};
