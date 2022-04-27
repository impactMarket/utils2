/**
 * Takes the frenquency interval in blocks and returns text format
 * @param {number} frequency The frequency in blocks
 * @returns {string} The frequency interval on text format
 */
export function frequencyToText(frequency: number): 'day' | 'week' | 'unknown' {
    if (frequency === 17280) return 'day';
    if (frequency === 120960) return 'week';

    return 'unknown';
}
