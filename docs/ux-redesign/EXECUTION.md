# Execution, acceptance and continuation record

Read [handoff](../../UX_REDESIGN_PLAN.md), [design specification](DESIGN_SPEC.md), [visual craft guide](VISUAL_CRAFT.md) and [workflow contract](WORKFLOW_CONTRACT.md) first. **Application implementation is not yet authorized.** The checkboxes below describe future work; documentation creation does not complete them.

## 1. Operating rules for every session

1. Inspect both repository branches and working trees. Read applicable repository instructions and the continuation record below. Preserve new user changes and the review branches.
2. Confirm explicit user approval for implementation exists in the active conversation. If absent, ask before changing application code. Once granted, record its scope/date here and do not repeatedly ask for the same scope.
3. Select the first unfinished task whose dependencies are complete. Read the affected source. Identify relevant S, R and W IDs before editing. Keep each task small enough to verify; split it further if needed without dropping requirements.
4. Implement the agreed design and actual behavior. Do not replace real API flows with fixtures to make a screenshot look successful. Test fixtures belong only to the test environment; the labelled landing example is intentionally static.
5. Run the task's relevant checks and inspect the rendered result using the visual craft guide's three-pass procedure. Record concrete visual defects and inspect their fixes before claiming completion. Compile/lint success cannot substitute for visual, keyboard, responsive and interaction checks.
6. Review the diff for lost functionality, accidental API changes, unrelated edits and untranslated labels. Record evidence and exact limitations. Complete a task checkbox only when its exit criteria are met.
7. Update this record before handing off: commit/ref, changed areas, test commands/results, screenshots, decisions, known failures and next concrete action. Commit focused slices when authorized; do not push, merge or deploy just because local work is complete.

If a session has limited capacity, complete fewer tasks to the same standard. Do not lower the standard, remove acceptance checks or mark partial work done to fit the model/context budget.

## 2. Ordered work packages

| Task | Dependencies | Deliverable and primary files | Exit criteria |
| --- | --- | --- | --- |
| T00 Baseline and fixtures | User implementation approval | Start frontend using existing configuration; capture current landing/editor/admin users and enumerate current controls. Add focused Playwright configuration and deterministic API fixtures if available setup is absent. | Baseline screenshots recorded; fixtures match actual contracts; existing UI can be exercised in learner/admin contexts without committing credentials. |
| T01 Tokens and shared primitives | T00 | `app/globals.css`, existing `components/ui`, active i18n resources. Apply typography/colors/spacing; fix nested hsl usage; consistent fields/buttons/status/dialogs. | Contrasts and focus checked; actual en/zh assessment labels render; no global token regression; lint/type checks pass. |
| T02 Shared navigation | T01 | Main/admin layouts, Sidebar, Topbar, navigation data. Preserve routes/resizing; one mobile drawer; contextual account/workspace destinations. | R01-R05 all reachable; keyboard resizing/persisted width and drawer focus/Escape work; no duplicate mobile navigation. |
| T03 Dashboard and library | T02 | Dashboard components; compositions library and row presentation. Add valid pagination, truthful recent counts, explicit async states. | S02/S03 and R04/R05 pass; first-use/failure/load-more tested, library tab and detail return retained. |
| T04 Persistence coordinator | T01 | New/edit editor orchestration and save/draft/unsaved hooks; query cache integration. Behavior change isolated from broad layout edits. | W01 delay/failure/race scenarios pass; unchanged assessed content produces zero PUTs; grading has no trailing save. |
| T05 Writing surface | T02, T04 | Editor/fields/toolbars, new and edit routes. Implement paper layout, grouped actions, all formatting and mobile controls. | S04 and R06-R13 pass; no editor capability lost; reference screenshots at required widths recorded. Language semantic change stays gated. |
| T06 Generation, feedback, revision | T04, T05 | Detail page, feedback/progress, composition types/query polling; safe read-only content renderer. | W02-W04 and S05 pass including nullable suggestions, safe text, independent revision, direct-edit warning and admin ownership. |
| T07 Documents | T03, T04 | Upload component/document detail and relevant queries. Clarify per-operation status and recoveries. | W05/S06/R17 pass with every advertised type, plain-text escaping and retry that does not repeat completed work. |
| T08 Admin users | T02 | Users list/detail, filter query handling, dialogs and per-user sections. | S07/W06/R20/R21 pass; URL state/back navigation and mutation errors verified; record admin reference screenshot. |
| T09 Admin rubrics and pricing | T01, T08 | Rubric groups/dialogs; pricing rows/forms/formatters. | S08/S09/R22/R23 pass; all fields/actions preserved; 100% weight validation and money/duration semantics verified. |
| T10 Admin metrics | T01, T08 | Metrics page and extracted metrics components. | S10/R24 pass; metric inventory matched to baseline, absent vs zero correct, charts have accessible data alternatives. |
| T11 Landing page | T01, T02 | `app/page.tsx`, runtime home translations; shared primitives for illustrative preview. | S01/R25 pass signed-in/out, en/zh, desktop/mobile; preview clearly illustrative, no skeleton artwork or unsupported claims; reference screenshot recorded. |
| T12 Account/subscription | T01, T11 | Auth layout/routes, subscription route and plan components. | S11/S12/R18/R19 pass; registration values survive back/failure and real plan terms remain intact. |
| T13 Whole-product consistency | T03, T06, T07, T09, T10, T12 | All redesigned routes plus loading/error fallbacks; retention audit and evidence record. | Every screen and R ID verified; relevant browser suite, lint, typecheck/build pass; known limitations clearly recorded for user testing. |

Task ordering is a dependency guide, not permission to skip later phases. T11 may be brought forward after T02 if early landing-page visual review is useful; record the sequence change. No subagent delegation is required by this plan.

Task completion:

- [ ] T00 Baseline and fixtures
- [ ] T01 Tokens and shared primitives
- [ ] T02 Shared navigation
- [ ] T03 Dashboard and library
- [ ] T04 Persistence coordinator
- [ ] T05 Writing surface
- [ ] T06 Generation, feedback, revision
- [ ] T07 Documents
- [ ] T08 Admin users
- [ ] T09 Admin rubrics and pricing
- [ ] T10 Admin metrics
- [ ] T11 Landing page
- [ ] T12 Account/subscription
- [ ] T13 Whole-product consistency

## 3. Deterministic functional acceptance scenarios

Use focused browser tests for risky workflows; do not add snapshot/unit tests that merely mirror simple styling. Delay/fail mocked network responses deliberately. An actual backend smoke test complements contract fixtures; keep its results separate and do not run destructive actions against the user's real records.

| Test | Setup and action | Required observable result |
| --- | --- | --- |
| A01 Create race | Delay first POST; type newer content; click Save and review | One create in flight; latest content persisted to returned ID before one grading request; no text loss |
| A02 Save ordering | Delay PUT A; edit B/C; resolve A | Editor keeps latest input; writes serial; Saved only after latest acknowledgement |
| A03 Failure/retry | Reject create or PUT; retry; separately simulate ambiguous POST timeout | Input preserved, errors actionable, confirmed failure can retry; uncertain create is not silently duplicated |
| A04 Assessed hydration | Open reviewed record, direct edit route, toggle autosave without edits | No PUT; feedback retained; direct edit requires warning before mutation |
| A05 Navigation | Dirty new/existing drafts; app link, mode switch, back, reload | Correct Stay/Save/Discard behavior where applicable; failed Save stays; browser limitation, if any, explicitly recorded |
| A06 Autosave off/empty input | Disable autosave; type; manual Save; try `<p></p>` and whitespace | No scheduled autosave; manual save works; empty rich text cannot be submitted |
| A07 Generate | Dirty draft; generation returns new ID and null content; poll success/failure | Original saved/preserved; navigate to returned record; accurate pending/failed states; no fake instant generated text |
| A08 Review progress | Exercise every stage, missing/unknown stage, regrading, polling error, terminal result | Meaningful translated labels; no false ETA/completion; polling stops at terminal state; leave/return works |
| A09 Revision | Reviewed original; click twice; success/failure | Single pending create, new ID/title/content on success, original feedback unchanged, no navigation on failure |
| A10 Original edit | Cancel warning; then explicitly proceed and save | Cancel produces no write; proceeding explains and reflects server feedback reset |
| A11 Content safety | English/Chinese rich text, legacy plain text, literal angle brackets, script-looking text, unsafe links | Formatting preserved where supported; plain text intact; scripts/unsafe links cannot execute |
| A12 Suggestion variations | Complete/partial/empty/omitted suggestions; unavailable-language and unknown status | No crash; full feedback remains accessible; missing fields handled honestly; no invented score |
| A13 Library paging | 20 items then short page; empty page; second-page failure | Correct accumulation/deduplication/end state; retry preserves old rows; no false total/global search |
| A14 Upload | Each supported type; oversize/rejected file; upload/extraction/create failures | Accurate operation-specific messages; retry resumes the failed operation; no repeated successful upload/create |
| A15 Document association | Known, stale, missing local link; re-render READY document | Valid link reused; no rerender create loop; stale link recoverable; cross-device limit not misrepresented |
| A16 Admin filters | Type quickly, filter, paginate, open detail and return, browser back/forward | Final query matches controls; page reset correct; list context preserved; no stale results replacing current query |
| A17 Admin mutations | User role/status/delete, rubric CRUD/invalid total, pricing edits/status; fail each mutation | Existing permissions/validation remain; target clear; input retained and success not shown on error |
| A18 Metrics | Full data, zeros, omitted/null rates/latencies/retention, empty period, fetch error | No NaN/crash/fabricated zero; units/scope clear; every baseline metric accessible; table alternatives readable |
| A19 Auth/subscription | Registration back/forward/failure; login/reset failure; subscription update success/failure | Values and actual semantics retained; clear status; no fake billing controls; auth routing unchanged |
| A20 Landing/navigation | Signed in/out; role switch; interface-language switch; all CTA/footer destinations | Accurate routes and copy; illustrative preview labelled; no dead link or duplicated mobile navigation |
| A21 Ownership | Admin inspects another user's records, then opens own work in learner context | Inspection uses admin read helpers; no unsupported own-record mutation on others; supported own editing retained |

Fixture set: empty account; populated learner with more than 20 compositions; 120-character title; several paragraphs of Chinese; long rich-text composition; each composition/progress state; partial feedback; each document state; admin lists with multiple pages; pricing with zero/nonzero price and null duration; metrics with zero/null/omitted fields; slow/failing responses. Use fictional content and test identities. Do not store real user compositions, tokens or secrets in screenshots or fixtures.

## 4. Visual, responsive and accessibility acceptance

For each completed screen, record what was actually inspected. Required viewports: **1440x900, 1024x768 and 390x844**. Perform a narrow-width check at **320px**, desktop **200% zoom**, and sidebar minimum/maximum widths on editor/feedback/admin pages. Include at least one Chinese view for every redesigned screen family, plus keyboard navigation throughout.

The acceptance rubric is pass/fail, not a subjective average:

| Dimension | Pass condition |
| --- | --- |
| Hierarchy | One obvious primary action per task area; heading, content and metadata clearly differentiated |
| Consistency | Uses documented tokens/type/spacing/primitives; no unexplained one-off visual style |
| Content | No raw translation keys, placeholder skeleton illustration, made-up metrics or unsupported product claims |
| Retention | All applicable R IDs reachable and functional; moved actions have a documented destination |
| Responsive | No page overflow, clipped controls or hidden essential capability; menus/dialogs fit; tables scroll locally when needed |
| Keyboard/focus | Skip link, nav, toolbar, menus, dialogs, resize and forms usable; visible focus, correct return after closing |
| Contrast/state | Text/control/focus contrast measured; status is understandable without color; loading/empty/error distinguished |
| Feedback | Save and mutation outcomes truthful; user input survives failure; progress is announced without excessive repetition |

Check normal text contrast at least 4.5:1, large text at least 3:1, meaningful control/focus indicators at least 3:1 where applicable. Use the [WCAG 2.2 standard](https://www.w3.org/TR/WCAG22/) for full criteria rather than claiming these few numbers establish compliance. The project's 44px mobile target preference is additional to the AA baseline.

Capture before/after screenshots of the same viewport and state. Initial reference set: landing hero (T11), editor (T05), admin users (T08). Put shareable fictional-data screenshots in `docs/ux-redesign/evidence/` when available, named like `T05-editor-desktop-en.png`. Large temporary browser traces may stay untracked, but record their location and relevant findings. No evidence assets exist yet. Do not create fake evidence files to satisfy the checklist.

If a reference receives explicit user approval, record that approval and use it to constrain later screens. Otherwise label it implemented/verified, not user-approved. A visual failure blocks completion even if automated tests pass. Each visual task must also include the short critique record from [VISUAL_CRAFT.md](VISUAL_CRAFT.md); merely saving a screenshot does not establish that it was inspected.

## 5. Commands and check scope

Run from the frontend repository, using the installed project toolchain:

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

The earlier scoped lint command was `node node_modules/eslint/bin/eslint.js app components lib types context`. If broader `npm run lint` reveals an unrelated baseline issue, report it accurately and distinguish changed-code checks; do not silently suppress the rule. `npm run dev` starts the frontend for browser inspection. `NEXT_PUBLIC_API_BASE_URL` is read by `lib/constants.ts` and defaults to `http://localhost:8080`; use existing local configuration, not hardcoded production/test endpoints in application code.

T00 must install/configure the smallest useful Playwright setup if absent; after that use its actual documented command, normally `npx playwright test`. Do not claim a nonexistent `npm test` script ran. API fixtures should conform to current server DTOs and exercise failure/order behavior, not just return static success for every route.

For CSS-only slices, focus on visual/keyboard checks plus lint/type checks; run production build at coherent milestones and final completion. For persistence changes, run the relevant race/failure browser scenarios. No need to rerun the Java reactor for frontend-only changes. If a separately approved backend contract change becomes necessary, add its specific server tests and rerun dependent client checks; update this plan before widening scope.

## 6. Continuation record

### Current checkpoint: 7 September 2026

- Approval: **pending; no redesign application changes authorized or implemented**.
- Reviewed refs: frontend `3c859bf`, backend `e8efc85`, both on `review/assessment-metrics-20260906`.
- Active redesign branch in each repository: `feature/calm-writing-studio-20260906`.
- Completed: preimplementation working-tree review/checkpoints and this documentation handoff.
- Visual handoff strengthened following the user's request: VISUAL_CRAFT.md records the intended art direction, three representative screen blueprints, asset rules and a required visual refinement procedure. This remains documentation, not an implemented or approved mockup.
- Browser evidence: none yet; plan is source-grounded.
- Newly recorded gaps: runtime translation resource mismatch; two skipped Java integration tests in the earlier passing reactor run. See handoff for precise baseline scope.
- Pending product decisions: semantic replacement of composition-language selector; any durable document/revision relationship or new backend scope. Preserve current control/contract while pending.
- Next action: present the recorded plan to the user. Begin T00 only after explicit implementation approval.

Append one entry per completed or handed-off slice, using this template:

```text
Date / task / status:
Approval scope (only when newly granted/changed):
Branch and commit(s):
Implemented behavior and affected S/R/W IDs:
Changed files / new shared interfaces:
Checks: exact commands, pass/fail/skipped, relevant A IDs:
Rendered evidence: paths, viewport, language, role, state:
Retention audit: capability -> new location -> verification:
Decisions changed: old -> new, reason, user approval if needed:
Known failures or unverified cases:
Next exact task/action:
```

Do not replace this history with a vague "all done" summary. Before final delivery, match every task, screen and retention ID to evidence, list unresolved limitations, and give the user the branches/commits and concrete testing instructions. The user will test and finalize the work separately.
