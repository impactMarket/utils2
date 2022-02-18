/**
 * Takes the frenquency interval in blocks or seconds and returns text format
 * @param frequency The frequency in blocks or seconds
 * @returns The frequency interval on text format
 */
export function frequencyToText(frequency: number): 'day' | 'week' | 'unknown' {
    if (frequency === 86400 || frequency === 17280) return 'day';
    if (frequency === 604800 || frequency === 120960) return 'week';
    return 'unknown';
}
