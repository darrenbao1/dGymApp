/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "plus.unsplash.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "pbs.twimg.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "abs.twimg.com",
				pathname: "**",
			},
		],
	},
};

module.exports = nextConfig;
