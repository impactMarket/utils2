type AggregateDataTypeInput = { [key: string]: any }[];
type AggregateDataTypeOutput = { [key: string]: number }[];

/**
 * Aggregates data by week or month
 * @param {AggregateDataTypeInput} data Array of data to aggregate
 * @param {string} aggregationLevel Agregation level, either 'week' or 'month'
 * @returns {AggregateDataTypeOutput} Aggregated data
 *
 * @example
 * const data = [
 *    { dayId: 1, value1: 10, value2: 20 },
 *    { dayId: 2, value1: 5, value2: 15 },
 *    { dayId: 8, value1: 3, value2: 7 }
 * ];
 *
 * const result = aggregateObjects(data, 'week');
 *
 * // $ result
 * // [
 * //    { value1: 15, value2: 35 },
 * //    { value1: 3, value2: 7 }
 * // ];
 */
export function aggregateObjects(
    data: AggregateDataTypeInput,
    aggregationLevel: 'week' | 'month'
): AggregateDataTypeOutput {
    const result: { [keyp: string]: { [key: string]: number } } = {};

    const getDayId = (dayId: number, aggregationLevel: 'week' | 'month'): string => {
        if (aggregationLevel === 'week') {
            return Math.floor(dayId / 7).toString();
        }

        return Math.floor(dayId / 30).toString();
    };

    data.forEach(d => {
        const dayId = getDayId(d.dayId, aggregationLevel);

        if (!result[dayId]) {
            result[dayId] = {};
        }

        Object.keys(d).forEach(key => {
            if (key !== 'dayId') {
                const value = d[key];
                const parsedValue = typeof value === 'string' ? parseFloat(value) : value;

                if (result[dayId][key] === undefined) {
                    result[dayId][key] = parsedValue;
                } else if (typeof result[dayId][key] === 'number' && typeof parsedValue === 'number') {
                    result[dayId][key] += parsedValue;
                }
            }
        });
    });

    return Object.values(result).map(d => d);
}
