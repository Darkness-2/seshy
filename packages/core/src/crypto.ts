const CHUNK_SIZE = 0x2000; // Process base64url conversions in chunks of 8kb
const textEncoder = new TextEncoder();

/**
 * Converts a Uint8Array to a base64url-encoded string.
 * Removes padding ("=") characters.
 * @param array to convert
 * @returns base64-url encoded string
 */
export const uint8ArrayToBase64url = (array: Uint8Array): string => {
	// First convert to binary string in chunks
	let binary = "";
	for (let i = 0; i < array.length; i += CHUNK_SIZE) {
		const chunk = array.subarray(i, i + CHUNK_SIZE);
		binary += String.fromCharCode(...chunk);
	}

	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

/**
 * Generates a secure base64url-encoded string of the given size in bytes.
 * @param bytes number of bytes to generate
 * @returns base64url-encoded random string
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
 */
export const generateSecureRandomString = (bytes: number): string => {
	const arr = crypto.getRandomValues(new Uint8Array(bytes));
	return uint8ArrayToBase64url(arr);
};

/**
 * Approved hash algorithm for Seshy.
 */
export type SeshyHashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";

/**
 * Generates a base64url-encoded hash of the input string using the given algorithm.
 * @param input to create a hash for
 * @param algorithm Seshy-allowed algorithm to use
 * @returns base64url-encoded hash of the input string
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 */
export const generateHash = async (input: string, algorithm: SeshyHashAlgorithm): Promise<string> => {
	const hash = await crypto.subtle.digest(algorithm, textEncoder.encode(input));
	const arr = new Uint8Array(hash);
	return uint8ArrayToBase64url(arr);
};

/**
 * Performs a time safe equals between the two provided strings.
 * @param a string one to compare
 * @param b string two to compare
 * @returns true if they match; false otherwise
 */
export const timingSafeEquals = (a: string, b: string): boolean => {
	const aArr = textEncoder.encode(a);
	const bArr = textEncoder.encode(b);

	const lengthsMatch = aArr.byteLength === bArr.byteLength;

	// Perform comparison of a against a if lengths don't match to avoid early return
	const right = lengthsMatch ? bArr : aArr;

	// Perform byte-by-byte comparison against full input size
	let diff = 0;
	for (let i = 0; i < aArr.byteLength; i++) {
		// XOR between two arrays returns 0 if they're equal, non-zero otherwise
		diff |= aArr[i]! ^ right[i]!;
	}

	// Fold length mismatch into diff so that if lengths were different, diff > 0
	diff |= aArr.byteLength ^ bArr.byteLength;

	return diff === 0;
};
