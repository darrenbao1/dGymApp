import FileToBase64 from "./FileToBase64";
/**
 * Uploads an image to the server after converting it to a base64 string.
 *
 * @param {File} image - The image file to upload.
 * @param {string} userId - The user's identifier.
 * @returns {Promise<string | null>} A promise that resolves with the uploaded image URL or null if there's an error.
 */
export default async function UploadImageBase64(
	image: File,
	userId: string
): Promise<string | null> {
	if (!image) return null;

	try {
		const fileStr = await FileToBase64(image);
		const res = await fetch("/api/uploadImage", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ image: fileStr, userId }),
		});

		if (!res.ok) {
			throw new Error(`Upload failed: ${res.status}`);
		}

		const data = await res.json();
		return data.url;
	} catch (error) {
		console.error("Error uploading image:", error);
		return null;
	}
}
