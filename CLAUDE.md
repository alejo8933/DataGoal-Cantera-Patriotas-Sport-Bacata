@AGENTS.md
# Project Context

## Stack
- Frontend: Next.js App Router + TypeScript
- Backend: TypeScript / FastAPI según módulo
- Database: Supabase PostgreSQL
- UI: Tailwind CSS o Chakra UI según proyecto

## Architecture
- Prefer Clean Architecture
- Keep domain and use cases independent from framework
- Supabase is infrastructure, not business logic
- Avoid putting business logic in UI, handlers, or controllers
- Prefer small, cohesive modules

## Project Structure
- frontend/: UI, pages, components, hooks, server actions
- backend/: domain, application, infrastructure, interfaces
- docs/: project notes if needed

## Coding Rules
- Prefer clear and maintainable code over clever code
- Keep functions small and focused
- Avoid duplication
- Use explicit names
- Do not use `any` unless strictly necessary
- Validate external input
- Handle errors explicitly
- Keep contracts stable between frontend and backend

## Workflow
- For complex changes, first propose a short plan
- For reviews, focus on bugs, architecture, types, tests, and risks
- For debugging, find root cause before proposing fixes
- For new features, preserve existing architecture and patterns
- Prefer incremental changes over large rewrites

## Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm test`

## Output Style
- Be concise and direct
- Do not explain obvious things
- Do not rewrite unrelated files
- Mention risks and assumptions clearly
- When context is missing, ask for the exact missing file, diff, log, or module