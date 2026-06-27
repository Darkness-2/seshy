import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig(
	[
		/**
		 * Including typescript-eslint rules.
		 * @see https://typescript-eslint.io/
		 */
		...tseslint.configs.recommendedTypeChecked,
		...tseslint.configs.stylisticTypeChecked,

		globalIgnores(["**/out/**", "**/build/**", "**/coverage/**", "**/dist/**"])
	],
	{
		rules: {
			"@typescript-eslint/array-type": "off",
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/consistent-type-imports": [
				"warn",
				{ prefer: "type-imports", fixStyle: "separate-type-imports" }
			],
			"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/prefer-optional-chain": "off",
			"@typescript-eslint/require-await": "off",
			"@typescript-eslint/switch-exhaustiveness-check": "error",
			"@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }]
		},
		languageOptions: {
			parserOptions: {
				projectService: true
			}
		}
	}
);

export default eslintConfig;
