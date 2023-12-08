import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");
const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		container: {
			center: true,
		},

		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				primary: "#2D9CDB",
				primaryHover: "#47B5F3",
				primaryActive: " #008BDA",
				carbon: "#262626",
			},
			fontFamily: {
				raleway: ["var(--font-raleway)"],
				inter: ["var(--font-inter)"],
			},
		},
	},
	plugins: [],
};
export default config;
