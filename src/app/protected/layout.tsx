import NavBar from "../components/NavBar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				{children}
				<NavBar />
			</body>
		</html>
	);
}
