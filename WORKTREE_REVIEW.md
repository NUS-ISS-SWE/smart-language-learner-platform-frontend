# Working-tree review — 6 September 2026

Reviewed the incoming assessment-progress UI, extracted metrics components, translations, and frontend types against the backend working tree.

## Correctness fixes

- Treat omitted nullable metrics as unavailable. The admin service uses non-null JSON serialization, so checking only `=== null` could call `toFixed` on `undefined`, or display `NaN` latency.
- Mark nullable response fields optional in TypeScript and preserve unavailable retention cells.

## Validation

- ESLint across app, components, lib, types, and context: passed.
- TypeScript `--noEmit`: passed.
- Next.js production build and route generation: passed.
- English and Chinese assessment-stage translations and backend stage names inspected together.

## Refactoring opportunities for the redesign branch

- Keep the useful metrics-component extraction; improve readability of compressed JSX and share formatting for units and unavailable values.
- Add accessible chart data alternatives and consistent empty/error states.
- Share navigation between learner and admin shells without losing sidebar resizing or any existing destination.
- Keep all useful controls: relocate secondary actions and add revision copies alongside existing editing.

This is a review checkpoint, not a production deployment or a rendered UX acceptance test. Backend changes and their review are on the matching `review/assessment-metrics-20260906` branch in the backend repository.
