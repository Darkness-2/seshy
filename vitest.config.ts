import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			provider: "v8",
			include: ["packages/*/src/**/*.{js,ts}"]
		}
	},
	resolve: {
		alias: {
			"@seshy/core": resolve(__dirname, "packages/core/src/index.ts"),
			"@seshy/sessions": resolve(__dirname, "packages/sessions/src/index.ts")
		}
	}
});
