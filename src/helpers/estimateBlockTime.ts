/**
 * Estimate remaining time until the end block, in seconds.
 * If the end block was in the past, add another epoch.
 */
export const estimateBlockTime = (currentBlock: number, endBlock: number) => {
    const isFuture = currentBlock > endBlock;
    const blocksPerDay = 12 * 60 * 24; // ~ amount of blocks in a day
    const blockTime =
        (endBlock - currentBlock + (isFuture ? blocksPerDay : 0)) * 5000;

    return new Date(new Date().getTime() + blockTime + 2000); // 2s overflow
};
