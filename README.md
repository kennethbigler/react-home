# Ken's Resume Website

![CI](https://github.com/kennethbigler/react-home/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/kennethbigler/react-home/branch/main/graph/badge.svg?token=MEHKW2MF4N)](https://codecov.io/gh/kennethbigler/react-home)
![License](https://img.shields.io/github/license/kennethbigler/react-home)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/kennethbigler/react-home/graphs/commit-activity)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://kennethbigler.com)

This is a website created by me to represent my resume, as well as for me to practice new technologies.

View the site at [kennethbigler.com](https://www.kennethbigler.com/)

## Usage

This website was made to learn, and demonstrate information about Ken Bigler. Most of my users are here for the [Blood on the Clocktower tool](https://www.kennethbigler.com/games/botc).

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) `>=24.11.0`
- [npm](https://www.npmjs.com/) `>=11.6.1`

### Setup

```bash
npm install
npm run start
```

The dev server runs at [http://localhost:5173](http://localhost:5173) by default.

> **Note:** `.npmrc` sets `legacy-peer-deps=true` so installs succeed while ESLint 10 and TypeScript 6 are ahead of some plugin peer ranges. Do not remove it until those upstream packages catch up.

### Common scripts

| Command | Description |
| --- | --- |
| `npm run start` | Start the Vite dev server |
| `npm run build` | Type-check and build production assets to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint and auto-fix `src/` with ESLint |
| `npm run lint:q` | Same as `lint`, but only reports errors |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:no-watch` | Run tests once |
| `npm run test:coverage` | Run tests with coverage reporting |
| `npm run knip` | Check for unused files, exports, and dependencies |
| `npm run lhci` | Run Lighthouse CI against the production build |
| `npm run analyze` | Analyze bundle size |

Formatting and style checks run through ESLint via [GTS](https://github.com/google/gts) (`eslint-plugin-prettier`), not a standalone Prettier CLI.

Production builds target `es2020` browsers (see `build.target` in `vite.config.ts`).

## Contributing

Check out the [issues tab](https://github.com/kennethbigler/react-home/issues) for some fun ideas to contribute!

Pull requests should pass CI, which runs:

- ESLint (`npm run lint:q`)
- TypeScript compile and Vite build (`npm run build`)
- Vitest with coverage (`npm run test:coverage`)
- Knip dead-code analysis (`npm run knip`)
- Lighthouse CI (`npm run lhci`)
- CodeQL analysis

See [CONTRIBUTING.md](CONTRIBUTING.md) for additional guidelines.

## Technologies Used

* [React](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vitejs.dev/)
* [Vitest](https://vitest.dev/)
* [GitHub Pages](https://pages.github.com/)
* [Material UI](https://mui.com/material-ui/)
* [React Router](https://reactrouter.com/)
* [Highcharts](https://www.highcharts.com/)
* [Jōtai](https://jotai.org/)
* [ESLint](https://eslint.org/) / [GTS](https://github.com/google/gts)
* [A11y MCP](https://github.com/ronantakizawa/a11ymcp)

## Deployments

To deploy the code, run `npm run deploy`. This builds the site and copies the output into `docs/` for GitHub Pages. Once your PR is merged to `main`, the updated site is live.

Use `npm run deploy:no-fetch` to skip fetching external Blood on the Clocktower script data during the build.
