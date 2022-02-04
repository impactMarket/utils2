import { expect } from 'chai';

import { estimateBlockTime } from '../estimateBlockTime';

const blocksPerDay = 12 * 60 * 24; // ~ amount of blocks in a day
const testableDate = (date: Date) =>
    date.toISOString().replace(/T/, ' ').replace(/\..+/, '');

describe('#estimateBlockTime()', () => {
    it('future (exact 1 day)', () => {
        const result = estimateBlockTime(87000, 87000 + blocksPerDay);
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() + 1);
        expect(testableDate(result)).to.equal(testableDate(expectedDate));
    });
    it('future (half day)', () => {
        // const result = estimateBlockTime(87000, 87000 + blocksPerDay / 2);
        // const expectedDate = new Date();
        // expectedDate.setDate(expectedDate.getDate() + 1);
        // expect(testableDate(result)).to.equal(testableDate(expectedDate));
    });
});
