import { describe, expect, it } from "vitest";

import { generateSecureRandomString } from "./crypto.js";

describe("generateRandomSecureString", () => {
	it("generates random strings", () => {
		const test1 = generateSecureRandomString(16);
		const test2 = generateSecureRandomString(16);

		expect(test1).toBeTypeOf("string");
		expect(test2).toBeTypeOf("string");
		expect(test1).not.toEqual(test2);
	});

	it("generates base64url strings", () => {
		const expectedAlphabet = /^[a-zA-Z0-9\_\-]*$/;
		const test = generateSecureRandomString(512);

		expect(expectedAlphabet.test(test)).toBe(true);
		expect(test.includes("+")).toBe(false);
		expect(test.includes("/")).toBe(false);
		expect(test.includes("=")).toBe(false);
	});

	it("generates strings of appropriate lengths", () => {
		const small = generateSecureRandomString(8);
		const medium = generateSecureRandomString(64);
		const large = generateSecureRandomString(512);

		// Expect num_bytes * 8 / 6, rounded up
		expect(small.length).toBe(11);
		expect(medium.length).toBe(86);
		expect(large.length).toBe(683);
	});
});
