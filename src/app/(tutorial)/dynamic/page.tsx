import { UnsplashImage } from "@/models/unsplash-image";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
	title: "dynamic Fetching ",
};
//This is a demo of dynamic rendering, where the image is fetched at runtime.
//This is a good option if the image is going to change often.
//The downside is that the image is not interactive.
//revalidate = 0 is the equivalent of getServerProps in the old nextjs.
//revalidate will re-fetch for the entire page after 0 seconds.
//export const revalidate = 0;

export default async function Page() {
	const response = await fetch(
		"https://api.unsplash.com/photos/random?client_id=" +
			process.env.UNSPLASH_ACCESS_KEY,
		{
			// adding no-cache to a specific fetch request, instead of globally.
			//meaning you can have static rendering and dynamic rendering on the same page.
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached

			// next: { revalidate: 0 }, // this is also another way of adding revalidate to a specific fetch request.
		}
	);
	const image: UnsplashImage = await response.json();

	const width = Math.min(500, image.width);
	const height = (width / image.width) * image.height;
	return (
		<div className="flex justify-center items-center h-screen bg-gray-700 flex-col gap-10 ">
			<div className="font-raleway bg-blue-300 rounded-md max-w-screen-md shadow-lg text-gray-600 p-2">
				This page <b>fetches data dynamically</b>. Every time you refresh the
				page, you get a new image from the Unsplash API
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
