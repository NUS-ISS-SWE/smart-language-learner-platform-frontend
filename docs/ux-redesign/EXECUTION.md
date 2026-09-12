# Execution, acceptance and continuation record

Read [handoff](../../UX_REDESIGN_PLAN.md), [design specification](DESIGN_SPEC.md), [visual craft guide](VISUAL_CRAFT.md) and [workflow contract](WORKFLOW_CONTRACT.md) first. **Implementation is authorized.** The checkboxes below describe future work; complete one only when its listed acceptance criteria are met.

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

- [x] T00 Baseline and fixtures
- [x] T01 Tokens and shared primitives
- [x] T02 Shared navigation
- [x] T03 Dashboard and library
- [x] T04 Persistence coordinator (browser-history limitation recorded below)
- [x] T05 Writing surface
- [x] T06 Generation, feedback, revision
- [ ] T07 Documents
- [ ] T08 Admin users
- [ ] T09 Admin rubrics and pricing
- [ ] T10 Admin metrics
- [x] T11 Landing page
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

Capture before/after screenshots of the same viewport and state. Initial reference set: landing hero (T11), editor (T05), admin users (T08). Put shareable fictional-data screenshots in `docs/ux-redesign/evidence/`, named like `T05-editor-desktop-en.png`. Large temporary browser traces may stay untracked, but record their location and relevant findings. See the evidence index for implemented references and the limits of the original body baselines. Do not create fake evidence files to satisfy the checklist.

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

### Historical checkpoint: 7 September 2026

- Approval: **granted 7 September 2026 for the documented redesign scope**.
- Reviewed refs: frontend `3c859bf`, backend `e8efc85`, both on `review/assessment-metrics-20260906`.
- Active redesign branch in each repository: `feature/calm-writing-studio-20260906`.
- Completed: preimplementation working-tree review/checkpoints and this documentation handoff. T00 test foundation is in place: Playwright with Chromium, a local web-server configuration, and landing reference tests/screenshots. It remains open until contract fixtures cover the specified learner/admin states.
- In progress: T01 shared visual primitives and T11 public landing. The initial public reference is implemented and inspected at 1440px and 390px; remaining signed-in and Chinese runtime browser checks keep both tasks open.
- Visual handoff strengthened following the user's request: VISUAL_CRAFT.md records the intended art direction, three representative screen blueprints, asset rules and a required visual refinement procedure. This remains documentation, not an implemented or approved mockup.
- Browser evidence: none yet; plan is source-grounded.
- Newly recorded gaps: runtime translation resource mismatch; two skipped Java integration tests in the earlier passing reactor run. See handoff for precise baseline scope.
- Pending product decisions: semantic replacement of composition-language selector; any durable document/revision relationship or new backend scope. Preserve current control/contract while pending.
- Next action: finish T00's deterministic contract fixtures, then implement T02 shared navigation before continuing the learner workflow slices. Re-run the language switcher interaction check during T02; its headless development test did not observe the pre-existing control's client-side update, so no conclusion has been recorded about its production behavior.

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

### 12 September 2026 — foundation review, shared shell, dashboard and library

- Approval reaffirmed: continue the plan and check refactoring opportunities. Both review refs remain unchanged.
- Starting ref: frontend `22f4097`. Verified checkpoint: frontend `6eab0c4`; backend plan pointer `e0dd156`.
- Reviewed the first landing/primitives slice. Restored the previously removed language interaction test. A dedicated localhost:3006 test server fixed the unreliable test environment; the full suite then exposed a real saved-language hydration race. A shared `useSyncExternalStore` translation hook now supplies the English server snapshot to each streaming boundary and observes the live locale after hydration. All application translation imports use it. HTML language and selected-language semantics update correctly.
- Improved landing hierarchy, 1024px preview stacking, mobile touch targets, focus, skip-link destination, reduced motion, and accurate signed-in/out CTAs. Restored the capability summary/footer. No interactive capability was removed.
- Refactored main/admin layouts into `WorkspaceShell`, with shared navigation, one native mobile drawer, keyboard/pointer resize and separate persisted admin width. Account controls retain subscription, language and logout. Native dialogs now trap focus, restore it after unmount, scroll within the viewport and preserve background scrolling state. Extracted shared dialog focus handling.
- Dashboard leads with continuing the most recently updated draft **within the fetched recent set**, new writing and upload. Supporting counts explicitly describe that set; unavailable document totals are not fabricated as zero. Subscription and admin overview remain accessible.
- Library uses infinite queries with separate cache keys. Composition arrays end on a short/empty page; document pages use their actual `hasMore`. IDs are deduplicated. Next-page failures preserve old rows and expose retry. Tabs remain URL-backed. Shared composition rows preserve title, status, language, dates and a safe plain-text preview. Document cards retain view/delete controls and translated metadata.
- Relevant coverage: S01-S03, R01-R05, R25; A13/A20; shared modal behavior and runtime Chinese assessment-stage resources. Save/generation/editor behavior is still the existing implementation; do not infer A01-A12 coverage from these tests.
- Checks: `npm run lint`, `npx tsc --noEmit`, `npm run build`, and consolidated `npx playwright test --workers=3` (24 passed) all passed. Earlier failures were retained and fixed, including language hydration and modal focus return. T00-T03/T11 meet their package exit criteria; the wider T13 verification limits below remain open.
- Evidence and visual critique: [evidence index](evidence/README.md). 35 fictional-data images captured. Initial editor/admin body baselines include the new shell; they are not claimed as pre-shell baselines. The original first landing reference remains recoverable at `22f4097` in its tracked snapshots.
- Independent incoming audit work remains outside this UX checkpoint: frontend audit page/API/hook/type exports and backend audit changes. Its navigation has moved from the old admin layout into `lib/navigation.ts`; preserve that entry with the incoming feature. Navigation tests assert it when the route exists. Do not commit the unrelated audit implementation as part of UX.
- Refactoring priorities next: replace competing create/autosave/manual-save paths with one persistence coordinator (T04); remove duplicate Tiptap link/underline registrations during T05; unify safe content rendering and fix generation/ownership handling in T06. Avoid broad backend or audit refactors.
- Known limits: browser tests use explicit API fixtures, not the live backend. 720px reflow checks approximate the CSS viewport of 200% desktop zoom; actual browser-UI zoom and assistive-technology checks remain in T13. Admin page bodies, auth and subscription still have later redesign work. Full workflow fixtures will be extended with each relevant task.
- Next exact action at this checkpoint: T04 (A01-A06) before broad writing-surface changes.

### 12 September 2026 — T04 persistence coordinator

- Branch: `feature/calm-writing-studio-20260906`, checkpoint `85a76ea`, following `6eab0c4`. Implementation approval remains in force.
- Refactor: `CompositionSession` is the single writer for creation, autosave, manual save, generation preparation and grading preparation. `useCompositionSession` owns its lifecycle/preferences/cache integration. Removed the superseded `useAutosave`, `useCompositionDraft` and `useUnsavedWarning` hooks after checking all callers. Their capabilities remain in the coordinator and `DraftNavigationGuard`.
- W01/A01-A06: joins in-flight writes, flushes newer input before review, preserves input when old acknowledgements arrive, prevents trailing PUT after grading, pauses on error, distinguishes confirmed rejection from uncertain POST outcomes, and does not update an unchanged assessed original. Direct editing of an assessed original requires an explicit warning because the existing server clears feedback on PUT. No new backend contract.
- App links, logout and Write/Upload switches offer Stay / Save and leave / Discard. Save failure keeps the editor and dialog open. Reload/close uses the native browser warning. A Chromium history diagnostic confirmed that SPA Back bypasses the dialog and Forward remounts an empty unsaved draft. **Unsaved text can be lost through SPA Back/Forward**; A05 permits this limitation to be recorded. Do not claim universal navigation protection or add global history monkey-patches. This remains a T13 risk to address or present during final testing.
- Manual Save now remains in the editor, with a visible View saved draft link. This preserves navigation while avoiding interruption of writing. Generation saves meaningful existing draft content first and navigates to the newly returned ID; a brand-new title-only generation request remains supported because it has no body to persist.
- Checks: six coordinator tests and eight of nine browser persistence tests passed in the first combined run. The reload test raced Tiptap's transaction after synthetic fill; waiting for the enabled review action before triggering reload corrected the test, and the isolated reload test passed. No production workaround was added for that test issue. Full consolidated verification is recorded in the following writing-surface entry.
- Retention: R06-R13 save/autosave/generate/review/edit controls retained; only obsolete competing hook implementations removed. The incoming audit files and `lib/navigation.ts` audit entry remain outside this slice.
- Next exact task: T05 paper layout and formatting groups, then T06 generation polling, safe detail rendering and independent revision.

### 12 September 2026 — T05 writing surface

- Branch: `feature/calm-writing-studio-20260906`, checkpoint `8bace47`, following `85a76ea`. No scope or approval change.
- S04/V02: new/edit workspace centered at 760px; title, formatting and body share one white paper boundary. Writing uses 18px/30px typography and 32px desktop / 20px mobile insets. Long titles wrap in an automatically sizing field; line breaks entered into the title normalize to spaces without altering other input.
- R06-R13 retention: Save draft and Submit for review remain visible beside save state; autosave remains visible as a preference. Writing options contains the existing composition-language selector with explicit automatic-detection guidance and Generate with separate-draft guidance. No language override is invented. Bold/Italic/Underline/Undo/Redo stay visible; More formatting contains all 14 other commands. All 19 commands retain labels and keyboard access. No useful capability removed.
- Refactor: `compositionExtensions()` owns the shared Tiptap schema and disables StarterKit's duplicate link/underline registrations before configuring those marks once. `useEditorState` refreshes toolbar state for cursor-only transactions. The title/editor no longer use nested Cards. Toggle now accepts an ID so its visible label activates the switch.
- Visual critique and filenames: [T05 evidence](evidence/README.md#writing-surface-t05). Inspected desktop, intermediate and narrow English/Chinese states, including both disclosures open. The first mobile pass exposed a clipped single-line title, now corrected with wrapping. Screenshot capture now resets scroll/focus before full-page capture, eliminating sticky-header artifacts from the evidence.
- Verification: `npx playwright test --workers=3` (48 passed), `npm run lint`, `npx tsc --noEmit` and `npm run build` all passed. Earlier focused runs: all nine persistence browser scenarios passed; all nine writing-surface scenarios passed after correcting a formatting assertion to allow Tiptap's trailing empty paragraph. No extension-duplication warnings remain in the tested editor.
- Limits carried forward: desktop Chromium at mobile CSS widths does not emulate a real on-screen keyboard. Browser-UI zoom, assistive technology and live-backend checks remain T13. SPA Back/Forward can lose unsaved content as documented in T04. No claim that T06 feedback/generation detail is complete.
- Next exact task: T06. Use `compositionExtensions()` in a safe read-only renderer; preserve legacy literal text/line breaks. Extend polling to GENERATING, handle GENERATION_FAILED, render the exact nullable suggestion/evidence DTOs without dropping full feedback, add independent revision creation and retain the assessed-original warning. Separate admin inspection context from an admin's own learner records. Then continue T07-T10, T12 and the T13 audit.

### 12 September 2026 — T06 generation, feedback and revision

- Branch: `feature/calm-writing-studio-20260906`, following `8bace47`; the user explicitly asked to continue during this slice.
- W02/S05: a shared three-second interval polls GENERATING and REVIEWING, stops at terminal states/unmount, and is reused by own/admin detail queries. Pending generation explains that the learner can leave and return. A failed GET preserves the last record with a status retry. GENERATION_FAILED offers a clearly labelled new generation record; it does not invent a retry endpoint or overwrite the failed record.
- W03: `CompositionReader` and the editable surface share the configured Tiptap schema. `compositionContent` treats recognized block-root markup as HTML parsed through that schema; other legacy prose becomes text nodes, preserving literal angle brackets, ampersands and line breaks. No unsafe HTML injection. Existing storage has no format discriminator, so legacy prose beginning with a valid HTML block is inherently ambiguous; this conservative detection rule is documented rather than claiming perfect format inference.
- Suggestions match the inspected Java records (`CompositionResponse`, `ImprovementSuggestion`, `SuggestionEvidence`): criterion, priority, recommendation, example revision, learning tip and excerpt/location. Preserve server order and unknown labels. Full feedback is a disclosure when suggestions exist and open by default otherwise. Missing/language-unavailable suggestions and missing completed feedback are explicit. Unknown assessment stages use neutral progress rather than marking steps complete. No score is fabricated.
- W04: Create revision POSTs an independent draft with the localized suffix and unchanged original content, then opens its editor. `CreateCompositionCopy` shares pending/error/uncertain-outcome handling with explicit failed-generation retries. `isUncertainMutationError` was extracted from the persistence coordinator; acknowledged cache writes now share `refreshCompositionCache`. A network/5xx create failure requires a library check before another POST. Original editing remains behind its warning, including direct /edit visits.
- Additional correctness review: edit visits now refresh the server record even inside the global 30-second cache window. `EditSessionLoader` captures only a successfully refreshed record; failure offers retry and cannot reuse cached editing status. Once mounted, the session retains its input through later cache changes. Invalid numeric addresses do not silently fetch a different record. Pending/uncertain detail grading cannot expose an edit action.
- Admin inspection links explicitly use `?context=admin` and the admin read endpoint; no own-record edit/review/delete/revision controls appear there. An admin's ordinary learner route uses the regular ownership-checked endpoint and retains editing. This does not alter server permissions. Source-document browser hints, metadata, view and download remain available, with stale-hint errors and truthful local-association copy.
- Visual: 55/45 layout only when the actual content container reaches 960px; otherwise stack with jump links. Paper typography matches T05. Suggestions use a restrained annotation edge and one example surface. Source labels and dates now follow the interface locale; `formatDate` gained an optional locale without changing existing callers.
- Checks: `npx playwright test --workers=3` (69 passed), `npm run lint`, `npx tsc --noEmit` and `npm run build` all passed. Focused tests covered generation stop/retry, untouched originals, uncertain copies, safe rich/plain content, null suggestions, unknown stages, ownership, delete cancellation, source links and fresh edit failures. An initial desktop geometry assertion ran before the stylesheet settled; polling the required final geometry corrected the test without altering the correct container rule.
- Evidence: `evidence/T06-feedback-{1440,1024,390,320}-{en,zh}.png`, with critique in the evidence index. Screenshots are fictional-data implemented references, not user approval. SPA history/real mobile keyboard/browser-UI zoom/assistive technology/live-backend limits remain open in T13.
- Next exact action: T07 upload/document recovery. The existing document component can repeat automatic creation after errors and fails to escape extracted text. Preserve upload→evaluation automation, expose the extracted text/title and operation-specific retries, validate local associations before reuse, and separate admin inspection from own documents. Then T08-T10/T12/T13.
