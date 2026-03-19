import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    ignores: [
      "src/__tests__/**/*",
      "src/__mocks__/**/*"
    ]
  },
  {
    files: ["src/**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    ignores: [
      "src/__tests__/**/*",
      "src/__mocks__/**/*"
    ]
  },
]);
