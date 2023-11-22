import { expect } from 'chai';

import { aggregateObjects } from '../src/aggregate';

describe('#aggregateObjects()', () => {
    it('week', () => {
        const data = [
            { dayId: 1, value1: 10, value2: 20 },
            { dayId: 2, value1: 5, value2: 15 },
            { dayId: 8, value1: 3, value2: 7 }
        ];

        const expectedOutput = [
            { value1: 15, value2: 35 },
            { value1: 3, value2: 7 }
        ];

        const result = aggregateObjects(data, 'week');

        expect(result).to.equal(expectedOutput);
    });

    it('month', () => {
        const data = [
            { dayId: 1, value1: 10, value2: 20 },
            { dayId: 2, value1: 5, value2: 15 },
            { dayId: 28, value1: 3, value2: 7 }
        ];

        const expectedOutput = [{ value1: 18, value2: 42 }];

        const result = aggregateObjects(data, 'month');

        expect(result).to.equal(expectedOutput);
    });

    it('empty', () => {
        const data: { [key: string]: any }[] = [];

        const expectedOutput: { [key: string]: number }[] = [];

        const result = aggregateObjects(data, 'week');

        expect(result).to.equal(expectedOutput);
    });
});
