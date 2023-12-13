import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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
				<Toaster position="top-right" />
				{children}
			</body>
		</html>
	);
}
