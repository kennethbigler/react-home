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
 * ESLint Flat Config with Compatibility Layer
 *
 * This config uses @eslint/compat utilities to bridge the gap between
 * ESLint's old config system and the new flat config system.
 *
 * Why we still use compatibility shims:
 * - fixupConfigRules: Converts old "extends" configs to flat format
 * - fixupPluginRules: Wraps plugins that don't support flat config yet
 * - FlatCompat: Allows using "extends" syntax in flat config
 *
 * These can be removed once all plugins natively support ESLint flat config.
 * Track progress:
 * - eslint-plugin-react: Partial flat config support, needs better TS integration
 * - eslint-plugin-import: Needs updated TypeScript resolver
 * - eslint-plugin-jsx-a11y: Working on flat config support
 * - eslint-plugin-react-hooks: Has flat config but compat provides better defaults
 *
 * Reference: https://eslint.org/docs/latest/use/configure/migration-guide
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

  // Use compat to extend plugin configs (maintains environment globals, settings, etc.)
  ...fixupConfigRules(
    compat.extends(
      "plugin:import/recommended",
      "plugin:import/typescript",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
    ),
  ),

  // Project-specific configuration
  {
    ignores: ["docs/*"],
    plugins: {
      import: fixupPluginRules(_import),
      "jsx-a11y": fixupPluginRules(jsxA11Y),
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
