import NavBar from "../components/NavBar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-screen fixed">
			{children}
			<NavBar />
		</div>
	);
}
