# AGENTS.md

Ken's resume site + games (incl. Blood on the Clocktower tool). React, Vite, TypeScript (strict), MUI + Emotion, Jotai, React Router, Vitest + Testing Library. Versions: see `package.json` (don't hardcode them in docs). Node `>=24.15`, npm `>=11.6`.

## 💬 Response style (always)

- ✂️ Brief. Lead with the answer; no preamble, no recap.
- 📊 Prefer bullets, tables, short headings over paragraphs. One idea per line.
- 😀 Use emoji as anchors (✅ ❌ ⚠️ 🔧 📁 🎯).
- 📚 Keep all technical detail (paths, commands, versions, causes) — cut prose, not facts.

## 🔧 Commands

| Task | Command |
| --- | --- |
| Dev server (`:5173`) | `npm start` |
| Tests once / watch | `npm run test:no-watch` / `npm test` |
| Full gate | `npm run verify` (tsc → knip → lint → coverage) |
| Build | `npm run build` (`tsc && vite build`) |
| Lint (auto-fix) | `npm run lint` |
| Dead code | `npm run knip` |

- `.npmrc` sets `legacy-peer-deps=true` on purpose — don't remove.
- Formatting is ESLint + Prettier (GTS). No standalone Prettier CLI.

## ✅ Definition of done

Run `npm run verify` (plus `npm run build` if build/config changed). All must pass:

- Tests pass, no new ESLint errors, `tsc` clean, knip clean
- Coverage ≥ 85% statements/functions/lines, ≥ 80% branches (project); ≥ 50% per file
- Details and patterns → `testing` skill

## 📁 Layout

```text
src/components/{common,games,resume}/   feature folders; Routes.tsx + Menu.tsx per area
src/jotai/<feature>-atom.ts             state (see below)
src/constants/                          static data (kebab-case files, UPPER_SNAKE exports)
src/apis/                               small utilities
src/test-utils/                         Jotai test helpers
src/images/  src/@types/  src/wrappers/
scripts/  public/  docs/ (🚫 generated)
```

- Tests co-located: `Name.test.tsx`; utilities in `tests/` subfolders
- Alias `@/` → `src/`. Use for imports ≥2 dirs up; keep `./` and single `../` relative
- Names: components PascalCase · utils camelCase · atoms `kebab-atom.ts`

## 🧩 Conventions

- **Jotai**: one `-atom.ts` per feature (base, derived, action atoms, types). Persist with `persistentAtom(key, initial)` from `src/jotai/storage.ts`, never raw `atomWithStorage`. Transient UI state → plain `atom()`. Expose per-field derived atoms for large state.
- **Types**: live beside their use or at canonical source. No re-export barrels.
- **Exports**: named exports only for cross-file APIs; keep local helpers private.
- **Constants**: no duplicated resume/profile facts — import the canonical constant.
- **A11y**: icon-only/custom clickable controls need an accessible name. Target WCAG 2.2 AA.
- **Memoization**: don't add `useMemo`/`useCallback`/`memo` by default → `react-maintenance` skill.
- Prefer small shared helpers over broad rewrites. When removing a feature, remove route/menu entry, tests, constants/state, and coverage metadata together.

## 🧭 Recipes

| Add | Do |
| --- | --- |
| Game | `components/games/<name>/` + `jotai/<name>-atom.ts` + `games/menu-items.ts` + `games/Routes.tsx` |
| Resume section | `components/resume/<name>/` + `constants/<name>.ts` + `resume/Routes.tsx` |
| Common component | `components/common/<name>/` + tests |
| Image | `src/images/<category>/`, prefer `.webp`/`.avif`, declare in `src/@types/images.d.ts` |

## 🚫 Boundaries

- ❌ **Never** edit, delete, regenerate, lint-fix, or clean `docs/` (generated GitHub Pages output)
- ❌ **Never** run `npm run deploy`, `npm run deploy:no-fetch`, or `scripts/deploy.sh` — user runs deploy
- ⚠️ Ask before adding dependencies or changing `vite.config.ts` / coverage thresholds
- ⚠️ Don't hand-edit `coverage/`, `codecov_reports/`, `dist/`

## 🧠 Skills (load on demand, `.claude/skills/`)

| Skill | When |
| --- | --- |
| `testing` | Writing/reviewing tests |
| `react-maintenance` | Refactors, dedupe, memoization |
| `a11y-checklist` | A11y audits and fixes |
| `sayc-bridge` | Any bridge bidding/convention question |

Skills are the single source of truth — don't copy their content elsewhere. Add a skill only for task-specific guidance; keep this file short and universal.

When you notice a repeated pattern or stale guidance, propose an update to AGENTS.md or the relevant skill.
