/**
 * Takes the frenquency in text format and returns interval in blocks
 * @param frequency The frequency interval on text format
 * @returns The frequency in blocks
 */
export function frequencyToNumer(frequency: 'day' | 'week'): number {
    if (frequency === 'day') return 17280;
    if (frequency === 'week') return 120960;
    return 0;
}
