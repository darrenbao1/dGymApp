export default function DateToStringSupabase(date: Date): string {
	return date.toISOString().slice(0, 10);
}
