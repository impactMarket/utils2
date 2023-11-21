export function aggregateObjects(
    data: { [key: string]: any }[],
    aggregationLevel: 'week' | 'month'
): { [key: string]: number }[] {
    const result: { [keyp: string]: { [key: string]: number } } = {};

    const getDayId = (dayId: number, aggregationLevel: 'week' | 'month'): string => {
        if (aggregationLevel === 'week') {
            return Math.floor(dayId / 7).toString();
        }
    
        return Math.floor(dayId / 30).toString();
    }

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
