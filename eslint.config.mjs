import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import cleanLayerImports from "./eslint/rules/clean-layer-imports.js";

export default [
  {
    languageOptions: {
      parser: typescriptParser, // Use @typescript-eslint/parser
      parserOptions: {
        ecmaVersion: "latest", // Use the latest ECMAScript version
        sourceType: "module", // Use modules (ES module support)
        project: "./tsconfig.json", // Path to your tsconfig.json for type-checking
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin, // Register the plugin for TypeScript linting
      "clean-arch": {
        rules: {
          "layer-imports": cleanLayerImports,
        },
      },
    },
    rules: {
      "no-unused-vars": "off", // Disable default unused-vars rule
      "@typescript-eslint/no-unused-vars": ["error"], // Enable TypeScript-specific rule
      "clean-arch/layer-imports": "error",
    },
    files: ["src/**/*.{js,ts,jsx,tsx}"], // Apply to TypeScript files in the src directory
  },
];
