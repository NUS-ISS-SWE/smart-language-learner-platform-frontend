# Visual implementation — 18–19 September 2026

## Authority and current state

The user said the earlier result looked too similar and approved all four proposed improvements: editor density, landing story, dashboard emphasis and the remaining screens. This is an implementation checkpoint, **not a verified release**. The implementation is committed in focused slices on `feature/calm-writing-studio-20260906`; no push, merge or deployment was made. The reviewed checkpoints stay unchanged.

This document supersedes earlier visual defaults where noted below. Keep `WORKFLOW_CONTRACT.md` and its capability-retention requirements. Historical checked boxes, passing tests and screenshots are not evidence for this new working tree.

## Revised visual defaults

- Canvas `#f7f6f2`; white functional surfaces; existing navy `#142b3d` and teal `#0f766e` remain the brand/action anchors.
- Landing hero `#f1eee6`; writing-prompt and illustrative-guidance surface `#f4eddf`. These accents are not status colors.
- Local editorial font stack (Georgia / Times New Roman / Songti / STSong / SimSun) is limited to brand, landing, account-story and exceptional fallback headings. Learner writing, user-provided titles, feedback, documents, subscription, dashboard content, controls and administrative data use the intentional system sans-serif stack; `Inter` is not named because it is not bundled or loaded. No font downloads or raster assets.
- Hero type: 48px narrow, 60px intermediate, 72px wide. No forced English line breaks; Chinese and long copy wrap naturally.
- Writing wrapper: **860px maximum**, superseding 760px. Body remains 18px/30px with 20px narrow and 32px wider insets.
- Large feature panels: 16px radii; paper and controls retain smaller radii. Limit shadows to paper/example/account surfaces. Avoid a card around each fragment.
- Preserve visible focus and 44px action targets. Navy panels use white/soft grey text and bright teal accents.

## Implemented screens

| Area                           | Implementation                                                                                                                                                                                                                                                                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing                        | Editorial hero and warm background; original → suggestion → revision example; dark workflow section. `LandingStory` uses real translated HTML and explicitly illustrative content. Existing capabilities, footer and auth-aware CTAs remain.                                                                                              |
| Dashboard                      | Navy writing panel, actual draft excerpt, clear continue/new/upload actions. Warm next-step panel points to reviewed work from the fetched set or offers a writing prompt. Recent rows, scoped counts, documents, subscription and admin overview remain.                                                                                 |
| Editor                         | Heading/back link share a wrapping row; tighter mode navigation and action rail. **Draft settings** clearly describes and groups autosave preference, language guidance and generation. The editor uses one Word-style formatting toolbar: all 19 compact icon controls remain visible, separated into familiar groups and wrapping only when width requires it. An empty editor visibly prompts the learner to start writing. Save/review/save state remain visible. |
| Feedback                       | Editorial heading and numbered suggestions reinforce the existing split layout, examples/evidence and full-feedback disclosure. Independent revisions and original-edit warning remain.                                                                                                                                                   |
| Documents / T07                | Larger upload affordance; readable filenames, metadata, extracted text, title and evaluation section. Download/delete and admin inspection remain. Admin links return to the originating account/tab.                                                                                                                                  |
| Admin users / T08              | Labelled filters, 300ms search debounce, URL pagination/filter state, clear filters, readable roles/statuses, initials and aligned table actions. Account/access and usage sections; return URLs retain list state and account tab. Modal errors remain visible; mutations refresh detail cache.                                          |
| Rubrics / T09                  | Stronger group selection, visible weight totals/coverage bars, full criterion descriptions, localized page/dialog/table labels. Existing weight validation retained, with error summary and invalid-field focus. Incomplete groups remain editable; do not silently normalize data to 100%.                                               |
| Pricing / T09                  | Complete catalog cards with edit/activate/retire. Extracted dialog includes display order. Feature textarea retains raw newlines while typing; normalize at submission only. Paid duration and free-plan no-expiry rules match the backend.                                                                                               |
| Metrics / T10                  | Activity, reliability and AI usage sections retain every prior metric. Chart gains count scale and full data table. Agent/cohort tables have labelled local scroll regions. Missing values differ from zero. Previous data/date range remain visible while changing dates.                                                                |
| Account/subscription / T12     | Shared editorial/navy context and readable forms. Visible registration steps, retained values/selection through back/failure, empty/error plan recovery. Shared plan details expose descriptions and all features. Shared password visibility. Current-plan panel and separate fetch/update recovery.                                     |
| Fallbacks / T13 implementation | Consistent loading/error/missing-page surfaces. Installed Next version's `retry` callback. Global error works without root providers/styles. Development diagnostics remain in a disclosure.                                                                                                                                              |

## Refactoring and contracts

- `PlanDetails` serves registration, subscription and admin catalog, accepting only rendered fields.
- `PasswordInput` owns show/hide and input padding. Auth routing/token handling/password requirements are unchanged.
- `compositionPreview` supplies React-escaped text for dashboard/library without browser DOM access during render. It is a preview extractor, not a sanitizer or replacement for the rich-text renderer.
- `metric-format.ts` distinguishes absent/null/non-finite from real zero.
- `formatCurrencyMinor` uses currency fraction digits rather than always dividing by 100; submitted raw values are unchanged. Incomplete currency input has a readable fallback.
- `useRubricCopy` centralizes enum labels and backend-name fallbacks.
- `adminReturnTo` accepts only internal admin user-list/account paths.
- Metrics retain previous query data during date changes and display that data's actual date range.
- English/Chinese copy is in `visual`, `metrics`, `rubrics` and existing namespaces.
- No runtime dependency, backend endpoint, database migration, payment flow or permission model was added.

## Functionality placement

No intentional feature removals. Generation/language/autosave preference live in **Draft settings**; all rich-text commands live in the single **Text formatting** toolbar; full assessment prose appears in **Full assessment feedback** when suggestions exist. Admin actions and document destinations remain. Registration now shows all plan features instead of only two. The dashboard prompt and landing example do not invoke generation or claim measured improvement.

## Motion and imagery decision

- Use brief, user-triggered feedback only: the Draft settings chevron rotates over 200ms and the existing reduced-motion rule disables that transition. Do not add looping, decorative or content-obscuring animation to writing, feedback or admin work.
- Do not add stock photography to the functional product. Generic student/office photos would add loading cost and visual noise without clarifying an action or building trust. The landing page already uses an illustrative writing sequence made from real interface content; retain that approach. A future campaign page may commission an original photograph or illustration with a specific narrative, ownership and accessible alt text.

## Verification status and remaining browser work

Follow-up implementation closure: user-search typing now replaces the intermediate URL rather than adding history entries; deliberate filters/pagination still push history. Metrics retain their last loaded result after a failed date-range request and explicitly identify the displayed period in English/Chinese. No additional planned screen implementation was identified in this focused pass. The broader carry-forward limits below remain explicit scope limits, not completed guarantees.

`npm run lint` and `npm run build` passed after the final code review. Focused commits separate foundations, public/learner/admin presentation, document recovery and follow-up correctness fixes. `git diff --check` was used before each commit.

The Playwright suite remains pending: its configured isolated server cannot start while the developer-owned Next server holds the shared `.next` lock, and that server does not use `SLLP_VISUAL_TEST=1`. Do not mark T07–T13 exit criteria complete yet.

When verification is requested:

1. Run TypeScript/lint/build/browser suite. Adjust only intentional layout/label assertions; retain persistence/ownership/recovery coverage. Editor scenarios must open Draft settings before changing autosave or language and assert the single Text formatting toolbar. Existing screenshots predate this direction.
2. Cover search debounce without lost focus/keystrokes, history/filter restoration, nested account returns, mutation errors, pricing newlines/order/currency, registration back/failure, and missing-versus-zero metrics.
3. Capture matched states at 1440/1024/390/320px in English/Chinese: both editor disclosures, populated/empty dashboard, authenticated/anonymous landing, long titles/file/plan names, admin tables, account forms and plan selection.
4. Critique actual density: paper should appear materially earlier than the old baseline; landing sequence and dashboard next action must read immediately. Check actual content widths, including resized sidebar.
5. Finish browser zoom, keyboard/screen reader, real mobile keyboard and live-backend checks. These were not completed in earlier slices either.
6. Audit retained capabilities before focused commits. Preserve independent audit changes in both trees; do not stage everything blindly.

Carry-forward limits: SPA Back/Forward can lose unsaved writing; document/composition associations are browser-local hints; revisions are independent drafts, not a backend graph; no new cross-tab/offline/idempotency guarantees. This visual pass does not resolve these limits.

## Post-upgrade retention and typography audit â€” 19 September 2026

This was a source-and-build audit against the reviewed checkpoint `1771cd6`, not an assertion that a production backend was exercised. No feature was intentionally removed.

| Contract area | Static audit result | Current destination |
| --- | --- | --- |
| R01â€“R05: shell, language, entry points and libraries | Retained | `WorkspaceShell`, `Topbar`, dashboard, library tabs and new-composition modes retain role-aware destinations, saved sidebar sizing and entry links. |
| R06â€“R09: editor and formatting | Retained | The writing paper still owns title/content. All nineteen commands are present in one grouped, wrapping **Text formatting** toolbar. Stored rich text, undo/redo, links and alignment are unchanged. |
| R10â€“R13: persistence, language, generation and review | Retained | Visible Save/Review actions and status remain in the action rail; `sllp.autosave.enabled`, language selection, generation and queued transitions remain in the existing editor/coordinator hooks. |
| R14â€“R17: feedback, revisions, deletion and documents | Retained | Feedback/full-feedback, source-document download, revision/original-edit protection, composition deletion, document upload, extraction, evaluation and document deletion remain present. |
| R18â€“R19: account and subscription | Retained | Login, registration, recovery/reset, visibility controls, plan selection and current-plan details still use their existing mutations/routes. |
| R20â€“R24: administration | Retained | User search/filter/pagination, account changes/deletion, inspection, rubric CRUD, pricing actions and all metric tables/chart controls remain connected to the same hooks and API helpers. |
| R25: public landing | Retained | Authentication-aware CTAs, language switcher and original footer destinations remain present; the new story is illustrative and does not replace an action. |

Typography findings and resolution:

- No font download, remote font URL, `@font-face`, `next/font` use or lingering `Inter` reference exists in application source.
- The globally inherited face is a platform/CJK-safe system sans stack. The sole monospaced exception is inline code in the rich-text editor.
- Editorial serif is now restricted to public brand/landing/account story and fallback headings. It is deliberately absent from learner input, user titles, feedback, documents, subscription, dashboard content, controls, tables and admin screens.
- The root-error boundary duplicates the same two stacks because it renders outside normal application styles.

Audit evidence: `npm run lint` and `npm run build` passed after this update; `git diff --check 1771cd6` reported no whitespace errors. The six isolated composition-session tests passed. The visual/browser suite requires an isolated Next server with `SLLP_VISUAL_TEST=1`; it could not run while the developer-owned server held the project lock without that fixture environment. Do not treat that as completed browser evidence; rerun `npm run test:e2e` after the existing server is stopped or in CI.

## Ownership

Changes are committed in the frontend branch. Independent pre-existing audit route/API/hook, admin exports/types and audit navigation remain intentionally uncommitted and preserved. T07 source is committed; evidence images accompany this implementation record. The prior committed UX checkpoint was `1771cd6`. This document does not claim that the deployed application includes the redesign.
