# Rooster Clash

A 1v1 rooster fighting game — frontend prototype built with **React 19**, **Vite 8**, and **TypeScript**.

## Requirements

- **Node.js >=22**
- **npm >=10**

## Stack

- **React 19** + **Vite 8** + **TypeScript 5**
- **ESLint 9** (flat config) + **Prettier 3**
- **Vitest 4** + **React Testing Library**
- **Husky** + **lint-staged** (pre-commit hooks)
- **GitHub Actions** CI

## Install & Run

```bash
npm install
npm run dev        # dev server → http://localhost:5173
npm run build      # production build
npm run preview    # preview production build
```

## Scripts

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `npm run dev`        | Start the dev server            |
| `npm run build`      | Build for production            |
| `npm run typecheck`  | Run TypeScript (`tsc --noEmit`) |
| `npm run lint`       | Run ESLint                      |
| `npm run lint:fix`   | Run ESLint with auto-fix        |
| `npm run format`     | Format all files with Prettier  |
| `npm run test`       | Run Vitest (single run)         |
| `npm run test:watch` | Run Vitest in watch mode        |
| `npm run dev:check`  | Format + typecheck + lint:fix   |

## Pre-commit Hooks

On every `git commit`, **Husky** triggers **lint-staged** which runs on staged files:

- `eslint --fix`
- `prettier --write`
- `tsc --noEmit --incremental false`
- `vitest related --run`

Commit is blocked if any check fails.

## CI (GitHub Actions)

Runs on every push and PR:

1. Format check (`prettier --check`)
2. Typecheck (`tsc --noEmit`)
3. Lint (`eslint`)
4. Tests (`vitest --run`)

## Project Structure

```
src/
├── App.tsx              # Main app flow
├── components/          # React UI components
├── core/                # Combat, storage, opponent logic
├── data/                # Starter fighters & archetypes
├── styles/              # CSS
└── types/               # TypeScript type definitions
```

## Branch Strategy

- `main` is protected — direct pushes are blocked
- All changes must go through a **pull request**
- CI must pass before merging
