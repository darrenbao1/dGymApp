import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});
const raleway = Raleway({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-raleway",
});
export const metadata: Metadata = {
	title: {
		default: "Workout Tracker",
		template: "%s | Workout Tracker",
	},
	description: "Demo project Darrenbao1",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${raleway.variable} font-sans`}>
			<body>
				{children}
				<NavBar />
			</body>
		</html>
	);
}
