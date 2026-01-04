# Repository Guidelines

## Project Structure & Module Organization
- `src/`: React + TypeScript app code. Pages live in `src/pages`, shared UI in `src/components`, and data in `src/data`.
- `public/`: Static assets served by Vite.
- `docs/`: Product/design specs (story architecture, data schema, interaction spec).
- `dist/`: Build output (generated).

## Build, Test, and Development Commands
- `npm run dev`: Start the Vite dev server.
- `npm run build`: Production build.
- `npm run build:dev`: Development-mode build for debugging.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint.
- `npm run typecheck`: TypeScript project typecheck (no emit).

## Coding Style & Naming Conventions
- TypeScript + React; keep components in PascalCase (e.g., `StorySection.tsx`).
- Tailwind CSS for styling; prefer utilities over custom CSS unless necessary.
- Follow ESLint output; don’t reformat beyond lint rules.
- Keep data IDs stable (see Data Contract Notes).

## Testing Guidelines
- No automated test runner is configured yet.
- Validate changes with `npm run typecheck`, `npm run lint`, and a quick manual UI pass.

## Commit & Pull Request Guidelines
- Use short, imperative commit messages (recent examples: “Add pre-commit lint and typecheck”).
- Keep commits scoped to one logical change.
- PRs should include a concise summary and screenshots/recordings for UI changes.

## Data Contract Notes
- Data is defined in `src/data/story-data.json` and validated by `src/data/storyData.ts`.
- The contract is documented in `docs/03_data_schema.md`.
- Update values without renaming IDs; narrative sections should reference metric IDs, not numbers.

## Maintenance Notes
- Keep this file concise and up to date when workflows or commands change.
- Prefer linking to `docs/` rather than duplicating long explanations.
