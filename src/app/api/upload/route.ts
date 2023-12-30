import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		let fileBuffer: Buffer | null = null;
		let userId: string | null = null;
		for (const [key, value] of formData.entries()) {
			if (typeof value === "object" && value !== null) {
				// Assuming 'file' is the key for the uploaded file
				if (key === "file") {
					// Convert the file to a Buffer
					const file = value as File;
					const arrayBuffer = await file.arrayBuffer();
					fileBuffer = Buffer.from(arrayBuffer);
				}
			}
			if (typeof value === "string" && value !== null) {
				if (key === "userId") {
					userId = value;
				}
			}
		}
		console.log("halfway there");

		const res: UploadApiResponse = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						resource_type: "image",
						max_file_size: 10 * 1024 * 1024,
						folder: userId ? userId : "no-user",
					},
					(error, result) => {
						if (error) {
							reject(error);
							return NextResponse.json({ error: "rejection here" });
						} else {
							resolve(result!);
							return NextResponse.json({ url: result?.secure_url });
						}
					}
				)
				.end(fileBuffer);
		});
		console.log("after res");

		return NextResponse.json({ url: res.secure_url });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: "error occurred" });
	}
}
