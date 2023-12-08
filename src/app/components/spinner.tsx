export const Spinner = () => {
	return (
		<div className="flex absolute top-1/2 w-screen justify-center">
			<div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-primary" />
		</div>
	);
};
