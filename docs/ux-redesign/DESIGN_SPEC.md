# Visual and screen specification

Authority and approval status: [handoff](../../UX_REDESIGN_PLAN.md). Behavior and preservation rules: [workflow contract](WORKFLOW_CONTRACT.md). Required evidence: [execution checklist](EXECUTION.md).

## 1. Design defaults

These are concrete implementation defaults for the selected calm writing studio direction. They are not a claim that a mockup has already been approved. Keep them consistent across learner, admin and public screens. Do not redesign each page independently.

### Palette and surfaces

| Semantic role | Default | Use |
| --- | --- | --- |
| Canvas | `#F6F8F8` | Main application background |
| Surface | `#FFFFFF` | Editor paper, dialogs, cards and tables |
| Heading/nav navy | `#142B3D` | Headings, desktop sidebar, strong text |
| Body ink | `#243746` | Paragraphs and field values |
| Muted text | `#536570` | Secondary metadata; never use opacity to make required text faint |
| Primary action teal | `#0F766E` | Main buttons and active controls, white foreground |
| Primary hover | `#115E59` | Hover/pressed primary actions |
| Soft teal | `#E7F3F0` | Selected backgrounds with dark teal text |
| Bright accent | `#2DD4BF` | Small decorative accents with navy foreground; not white small text |
| Surface divider | `#D7E0E3` | Noninteractive card/table separators |
| Input boundary | `#71838E` | Visible control outline where needed for contrast |
| Focus | `#0F766E` on light; bright accent on navy | 2px ring with 2px separation; visible on every surface |
| Success | `#166534` / `#F0FDF4` | Text/background plus label or icon |
| Caution | `#92400E` / `#FFFBEB` | Text/background plus label or icon |
| Error | `#B91C1C` / `#FEF2F2` | Error/destructive text and light background; solid destructive actions use white on dark red |

Validate actual rendered contrast; tokens alone do not establish compliance. Keep brand navy separate from the primary action role. Inspect existing `Button` variants and their consumers when mapping tokens: changing a global variable must not accidentally turn all secondary actions into competing primary buttons. Use Tailwind v4's existing `@theme` system, not a parallel theme mechanism. CSS variables already contain complete colors: use `var(--color-muted)`, not `hsl(var(--color-muted))`.

### Type, spacing and shape

- Keep the current sans-serif stack; append suitable Chinese system fallbacks such as `"PingFang SC", "Microsoft YaHei", sans-serif`. Verify UTF-8 rendering in the browser; terminal mojibake is not proof the source text is corrupt.
- Body: 16px/24px. Supporting text and table metadata: 14px/20px. Small badges: 12px/16px, never the only location of critical information.
- Application page heading: 32px/40px desktop, 28px/36px narrow. Section heading: 20px/28px. Landing hero: 48px/56px desktop, 36px/44px mobile. Weight 600 for most headings; avoid making every label bold.
- Composition body: 18px/30px, comfortable line length, title visually distinct. Feedback body: 16px/26px. Do not compress Chinese content into the Latin text's assumed word width.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px. Page gap 24px desktop/16px mobile. Section separation 32px. Label-to-field 8px. Field-to-field 20-24px.
- Card/dialog radius 12px; fields/buttons 8px; badge radius pill. Border 1px. Use a very subtle shadow only for elevated surfaces (menus/dialogs) and, optionally, the writing paper. Avoid nested bordered cards when a heading and divider suffice.
- Controls: 40px minimum desktop height; primary mobile touch areas 44px minimum, including icon-button hit areas. Table rows approximately 56px before wrapping. Lucide icons typically 18-20px, consistent stroke and alignment.
- Motion: 120-180ms for simple state transitions. No decorative perpetual animation. Respect reduced motion. Progress indicators must communicate state without animation.

### Layout and breakpoints

| Width | Shell | Content |
| --- | --- | --- |
| At least 1024px | One desktop sidebar and one topbar | Content padding 32px; allow flexible panels without horizontal page overflow |
| 640-1023px | One topbar and navigation drawer | Content padding 24px; stack feedback if available width is insufficient |
| Below 640px | One compact topbar and navigation drawer | Content padding 16px; stack rows/cards/actions; support 320px |

Desktop sidebar default stays 280px, clamped to the existing 224-420px range; preserve `sllp.sidebarWidth` and keyboard resizing. A collapse control may be added with an accessible label, but must not replace resizing. Admin and learner shells should share responsive behavior. Optional admin width persistence should reuse the common implementation without overwriting the learner's saved preference unexpectedly.

Topbar approximately 64px. Main content max width 1280px. Center writing paper at max width 760px; use 32px inner padding desktop and 20px mobile. Feedback detail uses a 55/45 composition/feedback split only when the **available content area** is at least 960px, with 24px gap; otherwise stack and show jump links. A wide sidebar must not crush the split view. Use container-aware layout or an equivalent measured constraint.

Use normal document scrolling for long pages. Sticky editor controls must not cover focused inputs, text or mobile keyboards. Dense tables may scroll horizontally inside a labelled region; the page itself must not overflow.

### Shared component behavior

Extend existing primitives before creating substitutes. Extract shared components when there are real repeated consumers, not to build an unused design system.

| Primitive | Required behavior |
| --- | --- |
| Page header | One h1, optional short description/breadcrumb, one dominant action; secondary actions wrap without overlap |
| Buttons/links | Pending label, disabled semantics, accessible icon name, stable size; use links for navigation |
| Field | Persistent label, helper/error association, required indicator where relevant, visible focus; preserve value on errors |
| Tabs | Correct selected state and keyboard behavior; link tabs if navigation changes URL |
| Status badge | Text plus optional icon, consistent semantic color, understandable without color |
| Async state | Layout-appropriate skeleton, explicit empty message/action, error with retry; retain existing data on refetch failure |
| Dialog/menu | One accessible name, unique IDs, keyboard operation, Escape, focus management and focus return; use native modal `showModal()` if retaining native dialogs |
| Notification | Inline actionable failures; announce save/progress updates politely without reading every keystroke |

Keep a skip-to-content link, landmarks, `aria-current` on active navigation, visible keyboard focus and meaningful heading order. Do not use raw backend enum strings as final user-facing labels. Target WCAG 2.2 AA, with 44px mobile targets as an additional project preference.

## 2. Navigation and feature placement

- Learner sidebar: Dashboard and Compositions. Documents remain the Documents tab in the composition library and remain reachable from upload and document detail links.
- Topbar/account area: interface-language switcher, current account/subscription context, Subscription destination, logout. Keep the public site's language switcher too.
- Administrators: explicit workspace switch between learner and admin areas; admin destinations Users, Rubrics, Pricing plans, Metrics. Preserve existing route paths and role restrictions.
- Remove duplicate *renderings* of mobile navigation by sharing the shell. This consolidates presentation; it must not remove any destination.
- Detail pages have contextual back navigation. Preserve library tab or admin list filters/page when returning. Do not send an admin viewing a user's document to the learner library by default.

## 3. Screen specifications

### S01: Landing `/`

Order: compact header, two-column hero, three-step writing workflow, concise capability summary, final CTA/footer. At narrow widths stack hero copy before the example; keep a readable example rather than hiding it entirely. Avoid forcing the hero to fill the entire viewport.

Suggested copy: headline **"Make your next draft clearer."** Supporting copy **"Write in English or Chinese, request AI-assisted feedback, and return to your work with a clear next step."** This is proposed product copy to translate accurately, not a promise of identical feedback across languages.

Primary CTA: signed out **"Create an account"** to `/register`; signed in **"Start writing"** to `/compositions/new`. Secondary: signed out **"Log in"** to `/login`; signed in **"Open library"** to `/compositions`. Header retains Dashboard access when authenticated.

The hero preview is rendered HTML/CSS using the real design primitives: a short fictional composition beside one clearly labelled **"Illustrative feedback example"**. Example passage: "Our class planted a garden behind the library. We visited it each week and watched the first leaves appear." Example suggestion: "Add one specific observation to show how the garden changed." It is static explanatory content, not a live tool, score, customer quote or generated service result. No skeleton bars, fake controls, fabricated statistics, testimonials, courses, or backend implementation copy. Explain the sequence Write or upload -> Request review -> Revise. Preserve existing footer links and auth-aware navigation.

### S02: Dashboard `/dashboard`

Lead with greeting and **Start writing**. **Upload document** is secondary. Show Continue writing only if a fetched draft exists; choose the most recently updated draft among fetched records and do not claim a global latest record. Recent work follows with title, language, status, updated time and clear destination. Subscription information remains visible secondarily, without competing as an equal hero action.

Any counts derived from the first page must say **"In recent work"**, not total compositions or lifetime progress. Do not invent a score from feedback text. First-use state explains writing/uploading; loading and failure are distinct. Recent row navigation must work with keyboard and long Chinese titles.

### S03: Library `/compositions` and `?tab=documents`

One page header with New composition and secondary Upload document. Keep both tabs and URL selection. Desktop composition rows: title, language, status, updated date, Open/Continue. Mobile: stacked title and metadata with a clear action; any secondary menu is labelled. Documents retain file name, relevant processing status and supported actions.

Use existing pagination to expose additional compositions through Load more. Retain loaded rows, prevent concurrent duplicate page fetches, deduplicate IDs and stop on short/empty page. Show initial empty, initial failure, later-page failure with Retry, loading-more and end-of-list distinctly. Do not add a global search box that filters only the first 20 records while suggesting full-library coverage.

### S04: New/edit composition `/compositions/new`, `/compositions/[id]/edit`

Centered writing paper with title, text editor and grouped formatting toolbar. Header/action rail gives **Request review** primary emphasis when valid; Save and its state stay visible. Generate draft and autosave preference move into a clearly labelled secondary group or menu. Keep every formatting command in the retention inventory; advanced commands may move to a labelled overflow menu. Mobile must expose them without clipping.

Write/upload modes remain discoverable and reflect navigation state; dirty content is protected on mode change. Show **Unsaved changes**, **Saving...**, **Saved**, **Couldn't save - Retry** accurately. Do not call data locally cached if only the preference is stored locally. Language guidance must distinguish detected composition language from the interface language. See the workflow contract before modifying autosave or submission.

### S05: Composition detail and feedback `/compositions/[id]`

Page header: title, status and useful metadata; contextual Back. Drafts offer Continue writing and Request review where allowed. In-progress states show the actual assessment/generation status and explain that the user can leave and return. No invented percentage or countdown.

Reviewed work: read-only composition paper and feedback panel using the responsive split rule. Render supported rich text safely; plain text and line breaks remain readable. Show structured suggestions with criterion, priority, recommendation, optional example revision, learning tip and supporting evidence. Preserve original full feedback in a **Full assessment feedback** disclosure when suggestions are available; without suggestions, show the full feedback open by default. Do not parse the report into an invented score or summary, and do not discard content to avoid duplication.

Primary reviewed action: **Create revision**, producing a separate draft. Secondary **Edit original** carries the feedback-clearing warning. Delete remains in secondary actions with confirmation. When suggestions are missing/unavailable, explain that condition without hiding general feedback. Preserve source-document navigation when known. Admin inspection uses appropriate read-only endpoints/ownership controls.

### S06: Upload and document detail `/compositions/new?mode=upload`, `/documents/[id]`

Upload panel clearly lists PDF, DOCX, PPTX and TXT, maximum 25MB, selection and drop affordances if supported. Keep existing upload functionality. Provide a filename and real status; no simulated upload percentages. Detail distinguishes uploading, extracting, ready, extraction failure, composition creation and creation failure. Keep extracted content readable and safely encoded. Preserve any existing document deletion/evaluation controls and title entry. Retry must not blindly repeat a completed upload or create operation. See linkage limits in the workflow contract.

### S07: Admin users `/admin/users`, `/admin/users/[id]`

List header and filter toolbar precede the table. Search debounce 300ms; role/status filters and pagination live in URL state, with page reset on filter changes. Clear filters is visible when active. Human-readable role/status labels, stable action column, loading and no-results states. Maintain browser back/forward behavior.

User detail sections: Account, Usage, Compositions, Documents. Keep status/role changes and deletion with their existing constraints, pending states, confirmation and errors. Preserve per-user usage data and all supported list actions. Returning from detail restores filters and page. On mobile stack summary/filters and use a labelled table scroll region when tabular relationships matter.

### S08: Admin rubrics `/admin/rubrics`

Keep language/difficulty grouping, group coverage, all criteria, weights, create/edit/delete and existing validation. Show group weight total next to the group heading with a clear valid/invalid state; preserve the 100% rule. Criterion dialogs use labelled inputs, clear error summary and field errors, save pending state and safe cancellation. Do not normalize or rewrite rubric data to make the screen look complete.

### S09: Admin pricing `/admin/pricing-plans`

Use structured rows/cards with name/code, formatted currency amount, duration, status, features and actions. Preserve create/edit/status controls and all editable fields. Display `priceMinor` in currency-aware units; do not hardcode a dollar sign or divide every currency by an assumed factor without verifying the contract. Label editing units explicitly. Null duration has a truthful label based on the actual plan semantics; do not invent a monthly interval. Keep feature editing stable while typing and preserve failed form input. Show empty catalog, fetch failure and mutation failure distinctly.

### S10: Admin metrics `/admin/metrics`

Group existing information into Activity, Assessment reliability and AI usage. Retain all current metric cards, date controls, activity chart, retention cohorts and per-agent table. Keep units, period versus lifetime scope and unavailable values explicit. Missing/omitted/null is **Unavailable** or an explained dash; genuine zero remains zero.

Charts include axes, legend and an accessible table or equivalent data view; no hover-only information. Retention cells distinguish absent observations from 0%. Date changes retain context while loading and show errors without wiping previous data. On narrow screens cards stack and dense tables scroll locally. Do not invent new calculations or remove a metric merely because it is hard to fit.

### S11: Auth `/login`, `/register`, `/register/success`, `/forgot-password`, `/reset-password`

Use one consistent account layout, readable form width around 440px, restrained brand context and predictable primary action. Preserve show/hide password, validation, recovery links, existing token handling and auth routing. Registration stays two steps: account/language/difficulty, then plan selection. Show current step, preserve values on back and failure, and keep each step's errors near its fields. Do not change auth or account permissions as a visual refactor.

### S12: Subscription `/subscription`

Lead with current plan/status then available plans using the same plan presentation as registration. Preserve plan selection/update behavior, price/currency/duration/features and current-plan indication. Show pending updates, success, fetch failure and update failure distinctly. No invented checkout, free trial, discounts or billing interval. Keep this destination discoverable in account navigation.

### S13: Shared fallbacks

Include `app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx` and existing route-not-found behavior in the consistency pass. Loading must not appear as an empty success state. Error actions should retry the failed operation or return to a safe existing destination. Do not expose internal stack traces or service infrastructure details as product copy.

## 4. What a successful visual pass looks like

At 1440px the dashboard's primary action, latest draft and recent work are immediately distinguishable. The editor reads as one writing surface with quiet tools. Feedback is easy to scan without losing the original composition. Admin tables are legible and actions align. The landing hero shows a real, labelled writing example. At 390px the same capabilities remain discoverable, text fits, and dialogs/menus/actions work. At 320px and 200% zoom there is no page-level horizontal scrolling or obscured essential content.

Use the first implemented landing hero, editor and admin users screen as reference screenshots for later slices. Record them in the execution log. If a later screen looks inconsistent, fix the screen or the shared primitive and recheck affected references; do not quietly create another visual system.
