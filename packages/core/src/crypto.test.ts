import { describe, expect, it } from "vitest";

import { generateHash, generateSecureRandomString, timingSafeEquals, uint8ArrayToBase64url } from "./crypto.js";

describe("uint8ArrayToBase64url", () => {
	const expectedAlphabet = /^[a-zA-Z0-9\_\-]*$/;

	it("generates valid base64url strings", () => {
		const randomInput = crypto.getRandomValues(new Uint8Array(1024));
		const test = uint8ArrayToBase64url(randomInput);

		expect(expectedAlphabet.test(test)).toBe(true);
		expect(test.includes("+")).toBe(false);
		expect(test.includes("/")).toBe(false);
		expect(test.includes("=")).toBe(false);
	});

	it("generates valid base64url strings of very large length", () => {
		const randomInput = crypto.getRandomValues(new Uint8Array(65536));
		const test = uint8ArrayToBase64url(randomInput);

		expect(expectedAlphabet.test(test)).toBe(true);
		expect(test.includes("+")).toBe(false);
		expect(test.includes("/")).toBe(false);
		expect(test.includes("=")).toBe(false);
	});
});

describe("generateRandomSecureString", () => {
	it("generates random strings", () => {
		const test1 = generateSecureRandomString(16);
		const test2 = generateSecureRandomString(16);

		expect(test1).toBeTypeOf("string");
		expect(test2).toBeTypeOf("string");
		expect(test1).not.toEqual(test2);
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

describe("generateHash", () => {
	it("generates correct SHA-256 hashes", async () => {
		const test1 = await generateHash("seshy", "SHA-256");
		const test2 = await generateHash("ZTpv8Z9ppOmuO5sBibIX5gTL0orUFtYn", "SHA-256");

		expect(test1).toEqual("bDTQNva7U0tDtll-ouBJpeQAumLZhNUhuEeutcXDVBc");
		expect(test2).toEqual("mzYBmQHAcQDXjARJgJYw8FsKAkI9sUrBw7bsj-IVqhU");
	});

	it("generates correct SHA-384 hashes", async () => {
		const test1 = await generateHash("seshy", "SHA-384");
		const test2 = await generateHash("ZTpv8Z9ppOmuO5sBibIX5gTL0orUFtYn", "SHA-384");

		expect(test1).toEqual("In6S8VD2arIyoO51v189b9Zg66GhsufLzjEa-RcB4njdCiy-27DeAkgalyY1PTVw");
		expect(test2).toEqual("KvQUgCFULOJFONIM-Mu1nLvSRRDrlshXKRs6lvhrizN0QW39z8HSzreLsaWOfWmL");
	});

	it("generates correct SHA-512 hashes", async () => {
		const test1 = await generateHash("seshy", "SHA-512");
		const test2 = await generateHash("ZTpv8Z9ppOmuO5sBibIX5gTL0orUFtYn", "SHA-512");

		expect(test1).toEqual("MfURG3pqShhSjMSl5_e2wvUclOTEiel0npSMmJXdpbNQDJ-2Cv7Ihayf2iTVM7qqfeuGTXBuUE2yECJXhSOv6w");
		expect(test2).toEqual("LppSywmO48nMK8zwbobeHsYbMYMxoXOAGUj9v6u0P9TJNS9ml_9qVa3e0fG5EXHGXMaotaQGP3x9u4L2gZ5KVg");
	});
});

describe("timingSafeEquals", () => {
	it("succeeds for matching strings", () => {
		expect(timingSafeEquals("seshy", "seshy")).toBe(true);
		expect(timingSafeEquals("ZTpv8Z9ppOmuO5sBibIX5gTL0orUFtYn", "ZTpv8Z9ppOmuO5sBibIX5gTL0orUFtYn")).toBe(true);
	});

	it("fails for non-matching strings of same length", () => {
		expect(timingSafeEquals("seshy", "yhses")).toBe(false);
		expect(timingSafeEquals("ZTpv8Z9ppOmuO5sBibIX5gTL0orUFtYn", "ZTpv8Z9ppOmuO5sBibIX6gTL0orUFtYn")).toBe(false);
	});

	it("fails for strings of different lengths", () => {
		expect(timingSafeEquals("seshy", "seshy2")).toBe(false);
		expect(timingSafeEquals("ZTpv8Z9ppOmuO5sBibIX5gTL0orUFtYn", "ZTpv8Z9ppOmuO5sBibIX5gTL0orUFtYnn")).toBe(false);
	});
});
