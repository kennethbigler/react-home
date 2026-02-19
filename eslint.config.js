import {fixupConfigRules, fixupPluginRules} from "@eslint/compat";
import _import from "eslint-plugin-import";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import {fileURLToPath} from "node:url";
import js from "@eslint/js";
import {FlatCompat} from "@eslint/eslintrc";
import gtsConfig from "gts/build/src/index.js";

/**
 * ESLint Flat Config (ESLint 10+)
 *
 * Compatibility layer (can remove when plugins ship native flat config):
 *
 * - FlatCompat: Translates legacy "extends" (e.g. "plugin:react/recommended")
 *   into flat config objects. Used for import, react, and react-hooks presets.
 *
 * - fixupConfigRules: Converts those translated configs so they work with the
 *   current config (e.g. plugin references, rule keys).
 *
 * - fixupPluginRules: Wraps plugin rules that still use deprecated context API
 *   (e.g. getSourceCode) so they work with ESLint 9/10 (sourceCode, etc.).
 *
 * Native flat config:
 * - jsx-a11y: Uses plugin's flatConfigs.recommended (no compat needed).
 * - react-refresh: Already flat-config compatible.
 * - GTS: Exports flat config (TypeScript, Prettier, Node).
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  // GTS base config (includes TypeScript ESLint, Prettier, Node plugin)
  ...gtsConfig,

  // jsx-a11y: native flat config (no FlatCompat)
  jsxA11Y.flatConfigs.recommended,

  // Legacy "extends" → flat via FlatCompat (import, react, react-hooks only)
  ...fixupConfigRules(
    compat.extends(
      "plugin:import/recommended",
      "plugin:import/typescript",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
    ),
  ),

  // Project-specific configuration
  {
    ignores: ["docs/*"],
    plugins: {
      import: fixupPluginRules(_import),
      react: fixupPluginRules(react),
      "react-hooks": fixupPluginRules(reactHooks),
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {ecmaFeatures: {jsx: true, impliedStrict: true}},
    },
    settings: {
      react: {version: "detect"},
    },
    rules: {
      // React
      "react/react-in-jsx-scope": "off",
      "react/no-did-mount-set-state": "warn",

      // React Hooks
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // React Refresh (Vite HMR)
      "react-refresh/only-export-components": "warn",

      // Import
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: ["**/*.test.{ts,tsx}", "src/setupTests.ts"],
        },
      ],

      // General
      "no-alert": "warn",
      "no-console": "warn",
      "no-lone-blocks": "error",
      "prefer-destructuring": ["error", {array: false, object: true}],

      // Override GTS's single quote preference with double quotes
      "quotes": ["warn", "double", {avoidEscape: true}],
    },
  },

  // Test file overrides
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "node/no-unpublished-import": "off",
    },
  },
];
