import { UnsplashImage } from "@/models/unsplash-image";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
	title: "Static Fetching ",
};

//This is a demo of static rendering, where the image is fetched at build time.
//This is a good option if the image is not going to change often.
//The downside is that the image is not interactive.
//async function because it only runs on the server.
export default async function Page() {
	const response = await fetch(
		"https://api.unsplash.com/photos/random?client_id=" +
			process.env.UNSPLASH_ACCESS_KEY
	);
	const image: UnsplashImage = await response.json();

	const width = Math.min(500, image.width);
	const height = (width / image.width) * image.height;

	return (
		<div className="flex justify-center items-center h-screen bg-gray-700 flex-col gap-10 ">
			<div className="font-raleway bg-blue-300 rounded-md max-w-screen-md shadow-lg text-gray-600 p-2">
				This page <b>fetches and caches data at build time.</b> Even though the
				Unsplash API always returns a new image, we see the same image after
				refreshing the page until we compile the project again
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
