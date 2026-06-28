/**
 * Generates a secure base64url-encoded string of the given size in bytes.
 * @param bytes number of bytes to generate
 * @returns base64url-encoded string
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
 */
export const generateSecureRandomString = (bytes: number): string => {
	const arr = crypto.getRandomValues(new Uint8Array(bytes));
	return btoa(String.fromCharCode(...arr))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
};
