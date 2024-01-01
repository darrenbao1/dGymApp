/**
 * Converts a Date object to a string in the format 'YYYY-MM-DD'.
 * This format is commonly used in databases like Supabase.
 *
 * @param {Date} date - The Date object to be converted.
 * @returns {string} - The date as a string in the format 'YYYY-MM-DD'.
 */
export default function DateToStringSupabase(date: Date): string {
	return date.toISOString().slice(0, 10);
}
