/**
 * Converts a File object to a Base64-encoded string.
 *
 * This function reads the provided File object using the FileReader API,
 * and returns a Promise that resolves to a Base64-encoded string representation
 * of the file's contents. The Promise is rejected if there's an error during
 * file reading.
 *
 * @param {File} file - The File object to be converted to Base64.
 * @returns {Promise<string>} A promise that resolves with the Base64-encoded string.
 */

export default function FileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
	});
}
