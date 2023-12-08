export default async function HelloPage() {
	await new Promise((resolve) => setTimeout(resolve, 5000)); // to test loading screen
	return <div className="flex"> hello</div>;
}
