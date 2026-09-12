# Calm writing studio: implementation handoff

**Status: implementation approved and underway; testing/finalization remains with the user.**

Updated 12 September 2026. This file is the entry point for a fresh session or a different model. Read the linked documents before editing application code. Implementation was explicitly approved on 7 September and continuation reaffirmed on 12 September. Do not ask again for the same scope.

## Read in this order

1. This file: intent, decisions, scope, branch state, and approval boundary.
2. [Design and screen specification](docs/ux-redesign/DESIGN_SPEC.md): concrete visual defaults and requirements for every existing screen.
3. [Visual craft guide](docs/ux-redesign/VISUAL_CRAFT.md): art direction, layout blueprints, asset choices, visual critique and refinement procedure. This explains how to achieve the intended finish, beyond applying tokens.
4. [Workflow and functionality contract](docs/ux-redesign/WORKFLOW_CONTRACT.md): preservation inventory, API constraints, and exact behavior for saving, reviewing, revising, and uploading.
5. [Execution and acceptance checklist](docs/ux-redesign/EXECUTION.md): bounded tasks, dependencies, test scenarios, evidence requirements, and continuation log.

These documents are the canonical plan. The backend repository contains a pointer, not a competing specification. If later user instructions change a decision, update the decision and affected acceptance criteria together. Do not silently reinterpret the design in a new session.

## Outcome and user decisions

Make the platform a calm, readable writing studio with equally polished learner and admin experiences. Improve visual hierarchy first, and fix workflows where the current behavior can confuse users or lose work. Desktop is primary; mobile must remain fully usable. Include the landing page and account flows in the full redesign.

| Decision | Status | Consequence |
| --- | --- | --- |
| Learners and administrators receive equal attention | User preference | Admin screens are required phases, not optional follow-up work. |
| Calm writing studio; refine the navy/teal identity | User preference | Use the restrained visual specification; do not introduce a different brand direction. |
| Desktop first, mobile supported | User preference | Optimize writing and dense administration on desktop; preserve all actions on narrow screens. |
| Phased full redesign | User preference | Deliver and verify bounded slices; avoid a single broad rewrite. |
| Include the landing page | Explicit user request | Replace its placeholder-like preview and improve its story and responsive layout. |
| Preserve potentially helpful functionality | Explicit user constraint | Move or improve controls; do not silently delete capabilities to simplify the screen. |
| Revision copy preferred | User preference | Make a new independent draft from assessed work while retaining the original and its feedback. |
| Keep editing the original available | Preservation interpretation | Offer it secondarily with an accurate warning before any write clears feedback. |
| Keep sidebar resizing | Supersedes initial simplification idea | Preserve pointer and keyboard resizing and stored width. |
| Existing stack and APIs first | Plan default | Reuse current components and dependencies; no backend redesign or migrations in the initial scope. |
| Detailed tokens, spacing and layout below | Plan defaults, not an approved mockup | Follow them for consistency; tune only for measured accessibility or demonstrated layout needs and log the change. |

No capability removal is approved. Two areas have explicit decision boundaries:

- **Composition language selector:** the API detects the language; create/update accept only title and content. Preserve the existing selector during visual work and add truthful detection guidance. Replacing it with a read-only detected-language field, or adding an actual language override, requires a separate user decision. The interface-language switcher remains fully functional throughout.
- **Document-to-composition linkage:** the existing association is browser-local. Improve retry/error behavior within that contract. Durable cross-device linkage or automatic deduplication requires backend scope discussion; do not claim it exists.

## Repository checkpoints

| Repository | Reviewed branch | Reviewed commit | Redesign branch |
| --- | --- | --- | --- |
| `smart-language-learner-platform-frontend` | `review/assessment-metrics-20260906` | `3c859bf` | `feature/calm-writing-studio-20260906` |
| `smart-language-learner-platform-backend` | `review/assessment-metrics-20260906` | `e8efc85` | `feature/calm-writing-studio-20260906` |

The original incoming changes and correctness fixes are checkpointed on the review branches for the user to test and finalize separately. Both redesign branches start from those checkpoints. This handoff adds documentation only. Do not amend, reset, merge, or otherwise rewrite the review checkpoints as part of the redesign. Branch names are local repository names; inspect their current remote state before any publishing action. This plan does not authorize a push, deployment, or merge.

Sibling layout expected by relative links:

```text
source/
  smart-language-learner-platform-backend/
  smart-language-learner-platform-frontend/
```

Before continuing, run `git status --short --branch` and `git log -1 --oneline` in each repository. New user changes take precedence: inspect and preserve them instead of assuming the recorded clean state is still current.

## Evidence already available, and its limits

- Frontend review: ESLint on application directories, TypeScript checking, and a production Next.js build passed. See [working-tree review](WORKTREE_REVIEW.md).
- Backend review: targeted Maven reactor build succeeded. Document tests: 15 executed; composition tests: 52 executed; admin tests: 20 executed and **2 integration tests skipped**. Do not describe that run as complete integration coverage. The local log, if still present, is `target/review/java-tests.log` in the backend repository and is ignored by Git.
- Python review: orchestrator suite 33 passed, including 3 PostgreSQL integration tests; suggestions suite 6 passed. SQL migrations 001-013 were exercised in a disposable PostgreSQL database. That was a SQL execution smoke test, not verification of every Liquibase upgrade path.
- The first implementation has now been refined and exercised in Chromium with fictional API fixtures. See [the execution record](docs/ux-redesign/EXECUTION.md) and [rendered evidence](docs/ux-redesign/evidence/README.md) for exact coverage. These are implemented references, not user-approved designs. Build success is not visual or workflow acceptance.
- A follow-up source check found assessment-stage keys in `public/locales` while runtime resources come from `locales/index.ts`. Fix and verify the active translation path in the first implementation slice; the earlier review of JSON labels did not establish runtime translation coverage.
- The English suggestions provider requires the canonical DEEP/MOE framework source before production readiness. The existing placeholder provider is for development. This redesign must not manufacture authoritative feedback, scores, or provider-readiness claims to fill that gap.

## Scope boundaries

In scope: visual tokens and primitives; learner/admin navigation; dashboard; composition and document library; editor; save coordination; generation progress; feedback and revision copies; uploads; users, rubrics, pricing and metrics administration; landing, authentication and subscription screens; loading/error/empty states; English/Chinese text; accessibility and responsive verification.

Out of scope unless separately approved: persistent revision history, course or vocabulary products, gamification, new analytics calculations, a billing provider, full-library search unsupported by the API, language override API, durable document linkage, new migrations, dark mode, auth/permission changes, production deployment. Out-of-scope ideas must not be implemented as fake controls or marketing promises. Existing working functionality discovered outside this inventory must be retained and added to the inventory.

## Starting a fresh model session

Use this instruction with either model:

> Read UX_REDESIGN_PLAN.md and all four linked specifications in the frontend repository, including VISUAL_CRAFT.md; if starting in the backend, follow its UX_REDESIGN_PLAN.md pointer. Inspect the current branches and changes. Preserve the reviewed checkpoints and all capabilities in the retention inventory. Consult the execution log and continue the first unfinished task only when implementation has been explicitly approved in this conversation. Follow the visual craft guide's composition and render-inspect-refine process. Do not substitute your own visual direction or call a task complete without its required evidence. If approval is absent, report readiness and ask before editing application code.

The execution log must carry decisions, completed work, evidence and the exact next action between sessions. A smaller model may need smaller tasks or more iterations; it must meet the same acceptance criteria. Written specifications reduce variation but cannot guarantee identical output. The first rendered reference screens and the recorded verification evidence are essential additional anchors.
