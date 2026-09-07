# Workflow and functionality contract

Read with the [handoff](../../UX_REDESIGN_PLAN.md) and [visual specification](DESIGN_SPEC.md). The requirements here take precedence over visual simplification. No useful capability is approved for removal.

## 1. Retention inventory

Before changing a screen, inspect its current implementation and extend this table for any omitted capability. After changing it, record its destination and verification under the corresponding execution task. A hidden or inaccessible control does not count as preserved.

| ID | Existing capability | Required destination/behavior |
| --- | --- | --- |
| R01 | Learner/admin routes and role-aware access | Shared shell, same working destinations and permissions |
| R02 | Sidebar pointer/keyboard resizing and saved width | Desktop shell; preserve `sllp.sidebarWidth`, 224-420px bounds, 280px default |
| R03 | Interface language, subscription context, logout | Topbar/account area; public language switching stays available |
| R04 | Writing and upload entry points | Dashboard, library and new-composition modes |
| R05 | Composition and document libraries/details | Library tabs with deep links and contextual return navigation |
| R06 | Title and rich-text content editing | Writing paper; preserve persisted formatting |
| R07 | Heading levels 1-3, bold, italic, underline, strike, highlight | Formatting toolbar or labelled overflow; all reachable on mobile/keyboard |
| R08 | Links, ordered/unordered lists, quote, code, left/center/right alignment | Same editor capability; validate safe links; do not silently flatten stored content |
| R09 | Undo, redo and clear formatting | Formatting toolbar/overflow; keep selection behavior |
| R10 | Manual save and autosave toggle | Save visible; toggle in labelled writing options; preserve `sllp.autosave.enabled` |
| R11 | Composition-language selector | Retain during visual phase; explain server detection; semantic replacement awaits user decision |
| R12 | Generate composition | Secondary Generate draft action; correct asynchronous independent-record behavior |
| R13 | Request grading and assessment progress | Primary eligible-draft action and truthful detail progress |
| R14 | Read feedback and source composition | Responsive side-by-side/stacked detail, full feedback retained |
| R15 | Edit original composition | Secondary action; explicit warning before assessed feedback can be cleared |
| R16 | Composition deletion | Secondary action with labelled confirmation and visible failure |
| R17 | Upload PDF/DOCX/PPTX/TXT, extraction, document evaluation/title and supported deletion | Upload/document screens; retain controls and supported types |
| R18 | Login, registration, plan selection, password visibility/recovery/reset | Consistent account screens without changing auth semantics |
| R19 | Subscription viewing and updating | Account destination and plan presentation; preserve server-provided terms |
| R20 | Admin user search/filter/pagination, role/status changes and deletion | Users list/detail with stable URL state and existing constraints |
| R21 | Admin per-user usage, composition/document inspection | User detail sections, contextual return, supported read-only access |
| R22 | Rubric language/difficulty coverage, criteria, weights and CRUD | Rubric groups and accessible dialogs; validation retained |
| R23 | Pricing fields/features, creation/edit/status actions | Pricing list and labelled form; all data and actions retained |
| R24 | All metrics, filters, charts, retention cohorts and agent metrics | Metrics groups with data alternatives and explicit units/unavailable values |
| R25 | Public authentication-aware CTAs and existing footer destinations | Redesigned landing page with accurate destinations |

New planned convenience: **Create revision** creates an independent draft using an existing endpoint. It supplements R15. There is no persistent linked revision history in this scope.

## 2. Source map and verified constraints

Paths below are relative to the frontend unless marked backend. Re-read affected code before editing; the checkpoint is a baseline, not a guarantee of future state.

| Concern | Source of truth |
| --- | --- |
| Theme/editor styles | `app/globals.css`; existing `components/ui` primitives |
| Shell/navigation | `app/(main)/layout.tsx`, `app/(admin)/layout.tsx`, `components/layout/Sidebar.tsx`, `components/layout/Topbar.tsx`, `lib/navigation.ts` |
| Editor/save behavior | `components/features/compositions/CompositionEditor.tsx`, `CompositionEditorFields.tsx`, `CompositionEditorToolbar.tsx`, `RichTextEditor.tsx`; `lib/hooks/useAutosave.ts`, `useCompositionDraft.ts`, `useUnsavedWarning.ts`; `app/(main)/compositions/new/page.tsx` |
| Composition API/cache | `lib/api/composition.ts`, `lib/hooks/useCompositions.ts`, `types/composition.ts` |
| Feedback/progress | `app/(main)/compositions/[id]/page.tsx`, `components/features/compositions/CompositionFeedback.tsx`, `AssessmentProgress.tsx` |
| Documents | `lib/api/document.ts`, `lib/hooks/useDocuments.ts`, `components/features/documents`, `app/(main)/documents/[id]/page.tsx` |
| Admin | `lib/api/admin*.ts`, `lib/hooks/useAdmin*.ts`, `components/features/admin`, `app/(admin)/admin` |
| Pricing/rubrics/subscription | `lib/api/admin-pricing.ts`, `lib/api/rubrics.ts`, `lib/api/subscription.ts` and corresponding hooks/components |
| Runtime translations | `lib/i18n/config.ts` imports in-memory `en`/`zh` from `locales/index.ts`. Editing `public/locales` alone does not update those resources. No subscription namespace is registered at this checkpoint. |
| Server composition behavior | Backend `sllp-composition-service/src/main/java/com/nus/iss/service/CompositionCommandService.java`, `CompositionCompletionService.java`, `CompositionQueryService.java`, `CompositionAccessService.java` |
| Response/suggestions | Backend `sllp-composition-service/src/main/java/com/nus/iss/dto/CompositionResponse.java`; `sllp-contracts/src/main/java/com/nus/iss/contracts/grading/ImprovementSuggestion.java` and `SuggestionEvidence.java` |

Current stack: Next.js/React/TypeScript, Tailwind v4, TanStack Query, Axios, Tiptap and Lucide. Reuse it. The current `package.json` scripts are `dev`, `build`, `start`, `lint`; there is no installed browser-test setup. The README contains legacy feature/test descriptions; routes, package scripts and source code take precedence.

### Composition API

| Operation | Endpoint | Contract |
| --- | --- | --- |
| List | `GET /api/v1/composition?page=0&size=20` | Array, no total count; backend ordering is created date descending |
| Read | `GET /api/v1/composition/{id}` | Owned learner record; admin inspection has separate existing API helpers |
| Create | `POST /api/v1/composition` | `{ title, content }`; language detected by backend |
| Update | `PUT /api/v1/composition/{id}` | `{ title, content }`; **sets DRAFT and clears feedback, suggestions and grading progress on every accepted update** |
| Review | `POST /api/v1/composition/{id}/grading` | Requires DRAFT; returns REVIEWING; async completion later |
| Generate | `POST /api/v1/composition/generate` | `{ title }`; returns a **new** GENERATING composition, not immediate replacement text |
| Delete | `DELETE /api/v1/composition/{id}` | Owned learner record |

Do not send language, source, revision IDs or unsupported fields expecting the server to persist them. Content must contain meaningful text, not just nonempty markup such as `<p></p>`. Preserve the application's actual title/content validation and show server rejection without losing local edits.

## 3. W01: Safe create, save and submit

Replace competing save paths with one coordinator per active editor/record. It owns the record ID, latest draft snapshot, last successfully persisted snapshot, pending work and error. Existing hooks can be refactored behind their callers; do not add a second independent persistence mechanism.

Required invariants:

1. **One write in flight per editor.** Create, autosave and manual save share the queue. While a write is pending, edits update the latest snapshot; they do not start another write or replace current input with a stale response.
2. **No write on hydration.** Initialize the persisted snapshot from loaded data. Mounting, changing focus, refetching or toggling autosave without editing must not trigger PUT. This is especially critical for assessed content.
3. **Dirty is based on persisted title/content.** It applies to existing records too. Local language UI/preferences alone do not imply a server content change. Tiptap normalization must not cause an unsolicited write just because the stored markup was loaded.
4. **Creation is shared.** A debounce, Save click and Request review click while the first create is pending await the same create result. After it resolves, use its ID to save any newer snapshot. Reset failed-create state so a verified rejected request can be retried. Never leave `createStarted` permanently blocking the user.
5. **Save means the latest version is persisted.** Resolve manual save only once the latest requested snapshot is acknowledged. An earlier response cannot report Saved while newer edits remain dirty. Invalidate/update relevant list/detail caches consistently.
6. **Autosave is optional.** Preserve its preference key. Use one debounce (default 2 seconds) for meaningful valid changes. Manual Save bypasses the delay. Disabling autosave cancels scheduled work, not a request already accepted by the server. Keep dirty state accurate.
7. **Submit is an ordered transition.** Flush current valid content, await success, then send grading exactly once. If saving fails, do not grade. Temporarily lock content changes during the final submit transition, announce the pending state, and unlock on failure. Cancel queued autosaves after grading begins so a late PUT cannot reset REVIEWING.
8. **Generation/review in progress is protected.** Do not allow background saves against GENERATING or REVIEWING records. Keep content inspection and navigation available; explain temporary action restrictions. Do not permanently remove editing functionality.
9. **Failures retain input.** Show Retry next to the failure; no success toast or navigation on failure. Distinguish a confirmed rejected create from an ambiguous timeout after a POST may have succeeded. Without server idempotency, do not auto-retry uncertain creation indefinitely or promise exactly-once creation; guide the user to check the library before an explicit retry.
10. **Navigation preserves choice.** Warn on browser unload when dirty, and guard application-controlled links, mode changes and cancel actions with Stay / Save and leave / Discard changes where appropriate. Save and leave waits for success. Test browser back/forward explicitly; do not claim the current `beforeunload` hook protects SPA navigation. If the existing router cannot safely cover a navigation case, record the exact limitation rather than installing a fragile global interception hack.

Deterministic sequence to implement/test:

```text
edit A -> autosave create(A) starts
edit B -> click Save -> still one create request
create(A) succeeds with id 42 -> update(42, B)
edit C while update(B) pending -> keep C in editor
update(B) succeeds -> update(42, C)
update(C) succeeds -> Saved
click Request review -> no redundant update if unchanged -> grade(42)
grade succeeds -> REVIEWING, no trailing autosave
```

This scope does not promise cross-tab optimistic concurrency or offline durable draft recovery. Preserve existing data and disclose actual failures; request backend scope if stronger guarantees are needed.

## 4. W02: Generate a separate draft

Generate draft remains available secondarily. Require a valid title. If the current editor is dirty, complete its save before creating generated work; a failed save blocks navigation/generation. POST generation once, navigate to the returned ID, and poll that record while GENERATING. Do not overwrite the original editor with `null` or pretend generation is synchronous.

Poll at the existing review cadence (3 seconds) while GENERATING or REVIEWING, stopping at terminal state/unmount. Preserve existing query caching and avoid multiple independent pollers. Distinguish GENERATION_FAILED from a temporary GET error. Retry GET without creating a record. A user-requested retry of failed generation uses the supported generation operation and must explain that it creates a new draft; no fictional retry endpoint. Handle absent content during generation without an empty-success screen.

## 5. W03: Assessment and feedback rendering

Backend composition statuses: DRAFT, GENERATING, GENERATION_FAILED, REVIEWING, REVIEWED. Grading stages: PREPARING, GRADING, REVIEWING, REGRADING, SUGGESTING. Stage name REVIEWING is distinct from overall composition status REVIEWING. Regrading is conditional; do not imply it always occurs. Missing or unknown stage shows a neutral in-progress label and any safe server message, not fabricated completion of earlier stages. Do not assume every language receives suggestions.

Extend frontend types to match existing optional/nullable fields:

```text
suggestionStatus?: string | null
suggestions?: Array<{
  criterion: string
  priority: string
  recommendation: string
  exampleRevision?: string | null
  learningTip?: string | null
  supportingEvidence?: { excerpt?: string | null; location?: string | null } | null
}> | null
```

Confirm the exact Java record when implementing. Keep unknown priority/status values readable with a neutral fallback. AVAILABLE can show cards; NOT_AVAILABLE_FOR_LANGUAGE explains language-specific unavailability. Omitted/empty suggestions do not mean the full feedback should disappear. Preserve server ordering unless a documented priority comparator is required; never rank by lexicographic priority text. Render evidence as text. No raw HTML injection from feedback, filenames or excerpts.

Use Tiptap's existing supported schema for a read-only rich-text view or another audited allowlisted renderer. Preserve the supported formatting inventory and safe URL protocols. Do not use unsanitized `dangerouslySetInnerHTML`. Legacy plain text must retain line breaks and literal `<`, `>` and `&`; extracted document text must be escaped before any conversion to paragraphs. Test both plain text and markup, including malicious-looking strings and Chinese content.

The API response does not expose a standalone composition score in the current frontend contract. Do not scrape a score from prose or invent a numeric dashboard score. Full assessment feedback stays available even when structured suggestions are shown separately.

## 6. W04: Revision copy and editing original

**Create revision:** for an owned assessed composition with usable content, POST a new draft with the same content and title `<original title> - Revision` (localize suffix). Leave original ID, content, status and feedback untouched. Navigate only after creation succeeds. Disable duplicate clicks while pending; on failure keep the original visible and allow a deliberate retry under W01's uncertain-create rule. The new record is an independent draft; do not display a linked history timeline or claim a relationship is persisted.

**Edit original:** preserve the action, but before enabling any autosave/write show: "Saving changes to this original will clear its current assessment feedback. Create a revision to keep the assessed version." Offer Create revision, Edit original, Cancel. Cancel performs no write. Merely opening an editor must never clear feedback. Direct `/edit` navigation to assessed content must enforce the same warning before mutation, not only a button-click warning on the detail page. Re-fetch status when needed to avoid enabling stale assessed/reviewing actions.

Admin inspection of another user's composition uses the existing admin read endpoint. Do not send another user's ID to an own-record mutation endpoint. Keep supported editing of the admin's own work through the learner context; do not broaden permissions or globally remove all admin editing.

## 7. W05: Upload, extraction and evaluation

States must identify the operation that failed: file validation, upload, extraction fetch/processing, or composition creation. Supported files are PDF, DOCX, PPTX and TXT up to 25MB. Verify MIME/extension behavior for real browser files, including empty MIME, against the existing server validator before changing client acceptance logic. Never advertise an unsupported format.

When extraction is READY, preserve the current evaluation path and title input. If composition creation is automatic in that path, guard it against repeated renders and reuse a known association; do not create on every poll. A failed extraction fetch retries the fetch, not the upload. A failed composition POST retries only when its outcome is understood. Keep extracted text visible after a creation failure.

Existing links rely on localStorage keys including `sllp.comp.{id}.docId`; inspect both association directions in the current implementation. They are hints, not durable server relationships. Check whether a stored target still exists; stale/deleted targets need an explicit recovery action, not a redirect loop. Do not promise cross-device deduplication or invent a document source field persisted by the composition API.

## 8. W06: Administration and localization

- Users search: debounce 300ms, reset page on search/filter change, preserve all active query fields, and prevent a late old query from replacing the new results. Use history replacement for intermediate typing and appropriate navigation for deliberate page/filter changes. Back/forward and contextual detail return must restore visible control values and results.
- Status/role/pricing/rubric mutations: preserve allowed values and server validation; disable duplicate submit, retain input on error, update relevant queries on success. Destructive confirmation includes the target name. A dialog must not close as if successful when mutation fails.
- Metrics: optional fields can be omitted because Java uses non-null serialization. Central formatters handle `null`, `undefined`, zero, percentages, durations and money deliberately. Never call `toFixed` on a missing value or show NaN. Preserve denominator/period definitions from the API and existing UI.
- Translations: use actual runtime resources. Add English and Chinese entries for all changed copy, including assessment-stage keys absent from `locales/index.ts`; register any genuinely needed namespace in both languages. Do not edit only unused JSON files. If consolidating resources, make that a bounded task with runtime proof rather than maintaining two diverging sources. Never present literal translation keys as labels.
- Avoid broad unrelated refactors. Useful opportunities within touched code: expand compressed JSX, share repeated value formatting and async states, unify real navigation duplication, and coordinate persistence. Keep API and auth boundaries intact.
