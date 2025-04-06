# Playroom Development Guide

## Build & Development Commands

- Start development server: `pnpm start` (basic) or `pnpm start:all` (all projects)
- Build projects: `pnpm build:all`
- Lint: `pnpm lint` (runs eslint, prettier, tsc)
- Format code: `pnpm format`
- Test: `pnpm test` (all tests)
- Run single test: `npx jest src/path/to/test.ts`
- Cypress tests: `pnpm cypress` (headless) or `pnpm cypress:dev` (UI)

## Code Style Guidelines

- Use TypeScript with strict mode
- React components should use functional style with hooks
- PascalCase for components, camelCase for functions/variables
- CSS uses vanilla-extract, utilize sprinkles and css.ts pattern
- Prefer explicit return types for functions
- Use named exports over default exports
- Import order: external dependencies first, then internal
- Use async/await for asynchronous code
- Follow eslint-config-seek conventions
- Error handling should use try/catch with explicit error typing
- Tests use Jest with snapshot testing where appropriate

Use `pnpm lint` before submitting changes to ensure compliance with project standards.
