import { IncomingForm } from "formidable";
import { promises as fs } from "fs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { NextApiResponse } from "next";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

type ResponseData = {
	url: string;
};

export async function POST(req: Request) {
	const formData = await req.formData();
	let fileBuffer: Buffer | null = null;
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
	}
	const res: UploadApiResponse = await new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{
					resource_type: "image",
					max_file_size: 10 * 1024 * 1024,
					folder: "testing",
				},
				(error, result) => {
					if (error) {
						reject(error);
					} else {
						resolve(result!);
					}
				}
			)
			.end(fileBuffer);
	});
	return Response.json({ url: res.secure_url });
}

// export async function POST(
// 	req: NextApiRequest,
// 	res: NextApiResponse<ResponseData>
// ) {

// const form = new IncomingForm();

// form.parse(req, async (err, fields, files) => {
// 	if (err) {
// 		res.status(500).json({ error: "Error processing the request" });
// 		return;
// 	}

// 	if (!files.file) {
// 		res.status(400).json({ error: "No file uploaded" });
// 		return;
// 	}

// 	const file = files.file[0];
// 	try {
// 		const fileData = await fs.readFile(file.filepath);

// 		cloudinary.uploader
// 			.upload_stream(
// 				{
// 					resource_type: "image",
// 					max_file_size: 10 * 1024 * 1024,
// 					folder: "testing",
// 				},
// 				(error, result) => {
// 					if (error) {
// 						res.status(500).json({ error: error.message });
// 						return;
// 					}
// 					res.status(200).json({ url: result?.secure_url });
// 				}
// 			)
// 			.end(fileData);
// 	} catch (error) {
// 		res.status(500).json({ error: "File upload failed" });
// 	}
// });
//}
