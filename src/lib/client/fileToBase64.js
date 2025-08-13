/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result !== 'string') {
				reject(new Error('Failed to read file'));
			} else {
				resolve(reader.result);
			}
		};

		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
}
