import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
	const body = await req.json();
	const fileStr = body.image;
	const folderName = body.userId;

	try {
		const res = await cloudinary.uploader.upload(fileStr, {
			resource_type: "image",
			max_file_size: 10 * 1024 * 1024,
			folder: folderName,
		});
		return Response.json({ url: res.secure_url });
	} catch (error) {
		console.log(error);
		return Response.json({ url: "" });
	}
}
