/**
 * Estimate remaining time until the end block, in seconds.
 * If the end block was in the past, add another epoch.
 * @param {number} currentBlock Current chain block.
 * @param {number} endBlock End block number.
 * @param {number} overflow Overflow in milliseconds.
 * @returns {Date} Remaining time in seconds.
 */
export const estimateBlockTime = (currentBlock: number, endBlock: number, overflow?: number): Date => {
    const isFuture = currentBlock > endBlock;
    // ~ amount of blocks in a day
    const blocksPerDay = 12 * 60 * 24;
    const blockTime = (endBlock - currentBlock + (isFuture ? blocksPerDay : 0)) * 5000;

    // add overflow
    return new Date(new Date().getTime() + blockTime + (overflow || 2000));
};
