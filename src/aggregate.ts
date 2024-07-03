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

/**
 * Builds an array of ids to query
 * @param {string} baseId Base id to build the query
 * @param {number} fromDayId From day id
 * @param {number} toDayId To day id
 * @returns {string[]} Array of ids
 *
 * @example
 * const result = buildIdAveragesQuery('avg-xpto-', 1, 5);
 *
 * // $ result
 * // ['avg-xpto-1', 'avg-xpto-2', 'avg-xpto-3', 'avg-xpto-4', 'avg-xpto-5'];
 */
export const buildIdAveragesQuery = (baseId: string, fromDayId: number, toDayId: number): string[] =>
    Array(toDayId - fromDayId)
        .fill('')
        .map((_, i) => `${baseId}${fromDayId + i}`);
