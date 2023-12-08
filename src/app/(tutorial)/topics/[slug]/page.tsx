import { UnsplashImage } from "@/models/unsplash-image";
import { Metadata } from "next";
import Image from "next/image";

interface PageProps {
	params: {
		slug: string;
	};
	// searchParams: { [key: string]: string | string[] | undefined }; how to get search parameters.
	//values after the ? in the url.
}

export function generateMetadata({ params: { slug } }: PageProps): Metadata {
	return {
		title: slug,
	};
}

export function generateStaticParams() {
	//This function is used to generate the static paths for the page.
	//This is used for static rendering.
	//In this example, we are generating the static paths for the topics page.
	//topic health, fitness and coding.
	//There will be no loading time because the page is already generated during build time.
	return ["health", "fitness", "coding"].map((slug) => ({ slug }));
}

export default async function Page({ params: { slug } }: PageProps) {
	const response = await fetch(
		`https://api.unsplash.com/photos/random?query=${slug}&count=10&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
	);
	const images: UnsplashImage[] = await response.json();

	return (
		<div className="w-screen bg-slate-500 h-[calc(100vh-80px)] overflow-auto p-6">
			<div className="font-raleway bg-blue-300 rounded-md max-w-screen-md shadow-lg text-gray-600 p-2 m-auto">
				This page uses <b>generateStaticParams</b> to render and cache static
				pages at build time, even though the URL has a dynamic parameter. Pages
				that are not included in generateStaticParams will be fetched & rendered
				on first access and then <b>cached for subsetsquent requests</b> (this
				can be disabled).
			</div>
			<div className="container">
				<div className="grid grid-cols-5 gap-2  self-center mx-auto w-fit h-max p-6">
					{images.map((image: UnsplashImage) => {
						return (
							<Image
								src={image.urls.raw}
								width={250}
								height={250}
								alt={image.description}
								key={image.urls.raw}
								className="flex justify-center items-center my-auto"
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}
