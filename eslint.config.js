import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import _import from "eslint-plugin-import";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "./node_modules/gts",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
        "prettier",
    )),
    
    {
        ignores: ["docs/*"],
        plugins: {
            "@typescript-eslint": fixupPluginRules(typescriptEslint),
            import: fixupPluginRules(_import),
            "jsx-a11y": fixupPluginRules(jsxA11Y),
            react: fixupPluginRules(react),
            "react-hooks": fixupPluginRules(reactHooks),
            "react-refresh": reactRefresh,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: { ecmaFeatures: { jsx: true, impliedStrict: true } },
        },
        settings: {
            react: { version: "detect" },
        },
        rules: {
            "react/react-in-jsx-scope": "off",

            "no-alert": "warn",
            "no-console": "warn",
            "react/no-did-mount-set-state": "warn",
            "react-hooks/exhaustive-deps": "warn",
            "react-refresh/only-export-components": "warn",

            "import/no-extraneous-dependencies": ["error", {
                devDependencies: ["**/*.test.{ts,tsx}", "src/setupTests.ts"],
            }],
            "no-lone-blocks": "error",
            "prefer-destructuring": ["error", { array: false, object: true }],
            "react-hooks/rules-of-hooks": "error",
        },
    },

    {
        files: ["**/*.test.ts", "**/*.test.tsx", "**/recoil-test-render.tsx"],
        rules: {
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "node/no-unpublished-import": "off",
        },
    }
];
