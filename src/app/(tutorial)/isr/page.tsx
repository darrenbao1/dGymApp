import { UnsplashImage } from "@/models/unsplash-image";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
	title: "Incremental Static Regeneration (ISR)",
};

export default async function Page() {
	const response = await fetch(
		"https://api.unsplash.com/photos/random?client_id=" +
			process.env.UNSPLASH_ACCESS_KEY,
		{
			next: { revalidate: 15 }, //This will revalidate the page every 15 seconds. (ISR) Incremental Static Regeneration
		}
	);
	const image: UnsplashImage = await response.json();

	const width = Math.min(500, image.width);
	const height = (width / image.width) * image.height;

	return (
		<div className="flex justify-center items-center h-screen bg-gray-700 flex-col gap-10 ">
			<div className="font-raleway bg-blue-300 rounded-md max-w-screen-md shadow-lg text-gray-600 p-2">
				This page <b>incremental static regeneration</b>. A new image is fetched
				every 15 seconds (after refreshing the page)
			</div>
			<Image
				src={image.urls.raw}
				width={width}
				height={height}
				alt={image.description}
				className="rounded-sm shadow-lg w-100 h-100"
			/>
			by
			<Link href={"/users/" + image.user.username}>{image.user.username}</Link>
		</div>
	);
}
