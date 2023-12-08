"use client"; //this page has to be a client side page because it is not pre-rendered.

interface ErrorPageProps {
	error: Error;
	reset: () => void; //has to be named reset because that is what the error boundary expects.
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	return (
		<div>
			<h1>Error</h1>
			<p>{error.message}</p>
			<button onClick={reset} className="text-center bg-green-400">
				Try again
			</button>
		</div>
	);
}
