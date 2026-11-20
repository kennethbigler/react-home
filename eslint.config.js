import { fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { flatConfigs as importXConfigs } from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierPlugin from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import globals from "globals";
import { configs as tsConfigs } from "typescript-eslint";

const reactPlugin = fixupPluginRules(react);
const withFixedReact = (config) => ({
  ...config,
  plugins: { react: reactPlugin },
});

/**
 * ESLint Flat Config (ESLint 10+)
 *
 * All plugins ship native flat configs (only eslint-plugin-react needs the
 * fixupPluginRules shim on ESLint 10).
 * Order matters: presets first, project rules last.
 */
export default defineConfig([
  // Never lint generated / build output.
  // `docs/` is the compiled site published to GitHub Pages — never touch it.
  globalIgnores(["docs/**", "dist/**", "coverage/**", "codecov_reports/**"]),

  { linterOptions: { reportUnusedDisableDirectives: "error" } },

  // Presets
  js.configs.recommended,
  tsConfigs.recommended,
  importXConfigs.recommended,
  importXConfigs.typescript,

  // React app code (src only)
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    extends: [
      jsxA11y.flatConfigs.recommended,
      // eslint-plugin-react still uses the pre-ESLint-9 context API;
      // fixupPluginRules shims it. Remove once the plugin updates.
      withFixedReact(react.configs.flat.recommended),
      withFixedReact(react.configs.flat["jsx-runtime"]),
      reactHooks.configs.flat.recommended,
      reactRefreshPlugin.configs.vite,
    ],
    settings: { react: { version: "detect" } },
    rules: {
      "react/no-did-mount-set-state": "warn",
      "react/jsx-no-leaked-render": [
        "error",
        { validStrategies: ["ternary", "coerce"] },
      ],
      // React Compiler companion lint for useMemo correctness
      "react-hooks/void-use-memo": "error",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true, allowCompoundComponents: true },
      ],
    },
  },

  // Type-aware linting (typescript-eslint recommended-type-checked).
  // Only for TS files that tsconfig.json includes.
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tsConfigs.recommendedTypeChecked],
    languageOptions: { parserOptions: { projectService: true } },
  },

  // Node scripts and tooling configs
  {
    files: ["scripts/**/*.mjs", "*.config.{js,ts}"],
    languageOptions: { globals: globals.node },
  },

  // Project configuration
  {
    plugins: { prettier: prettierPlugin },
    settings: {
      // Resolves `exports`-only packages (react-router v8, jotai v3 subpaths)
      // and the "@/" tsconfig path alias. Keeps import-x/no-unresolved honest
      // with no ignore list.
      "import-x/resolver-next": [
        createTypeScriptImportResolver({ alwaysTryTypes: true }),
      ],
    },
    rules: {
      // Prettier
      "prettier/prettier": "error",

      // Import
      // TypeScript already verifies default/namespace imports (and the plugin
      // false-positives on CJS-typed packages like highcharts and react).
      "import-x/default": "off",
      "import-x/namespace": "off",
      // jotai 3's type stub makes `jotai` and `jotai/utils` resolve to the same
      // file, so the autofix merges them and breaks type-checking.
      "import-x/no-duplicates": "off",
      // Lazy `import()` routes (menu-items <-> Home) are intentional cycles
      "import-x/no-cycle": [
        "error",
        { allowUnsafeDynamicCyclicDependency: true },
      ],
      "import-x/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.test.{ts,tsx}",
            "src/setupTests.ts",
            "src/test-utils/**",
            // Tooling configs and scripts legitimately import devDependencies
            // (vitest, @vitejs/plugin-react, playwright); they never ship.
            "*.config.{ts,js}",
            "scripts/**",
          ],
        },
      ],

      // TypeScript
      // Prefer `import { type Foo }` / `import type` for type-only bindings
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // General
      "block-scoped-var": "error",
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "no-alert": "warn",
      "no-console": "warn",
      "no-lone-blocks": "error",
      "no-restricted-properties": [
        "error",
        { object: "describe", property: "only" },
        { object: "it", property: "only" },
      ],
      "prefer-destructuring": ["error", { array: false, object: true }],
    },
  },

  // CLI scripts print to stdout by design
  { files: ["scripts/**/*.mjs"], rules: { "no-console": "off" } },

  // Type-checked rules beyond the preset
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // A `default` case counts as handling the remaining union members
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        { considerDefaultExhaustiveForUnions: true },
      ],
    },
  },

  // Plain JS files can't use type-aware rules
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [tsConfigs.disableTypeChecked],
  },
]);
