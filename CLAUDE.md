# Claude Code Project Instructions

@AGENTS.md

## Scope
- Follow `AGENTS.md` for repo conventions and commands.
- Keep changes scoped to the user request; avoid drive-by refactors.

## Data Work
- Use `docs/03_data_schema.md` as the source of truth.
- Do not change metric IDs; update values and sources instead.

## Quality Gates
- Run `npm run lint` and `npm run typecheck` when making code changes.
- Note any skipped checks in the final response.
