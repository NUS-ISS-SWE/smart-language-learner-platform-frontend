# Implemented visual references

Captured with fictional test identities and intercepted API responses on 9–12 September 2026. These are implemented references, **not user-approved** designs. Screenshots exercise the real application components; no permanent demo route or fake production data was added.

## Files and scope

- `T11-landing-{1440,1024,390,320}-{en,zh}.png`: signed-out landing, complete page.
- `T03-dashboard-*-*.png` and `T03-library-*-*.png`: populated admin-as-learner workspace, long titles and three statuses at the same widths/languages.
- `T03-documents-320-zh.png`: long document name, metadata, view/delete controls.
- `T02-drawer-*-*.png`: mobile navigation.
- `T02-admin-max-sidebar-1024-en.png`: 420px admin sidebar; table scroll is local.
- `T02-admin-reflow-720-zh.png`, `T02-admin-account-720-zh.png`: narrow CSS viewport corresponding to 200% zoom of 1440px. This is reflow evidence, not a claim of testing the browser's zoom UI.
- `T01-dialog-390-en.png`: existing rubric form using the improved modal primitive.
- `T00-*-body-before-en.png`: editor/admin **body** baselines before their redesign. The shell had already changed. Tests preserve these files rather than overwriting them.

## Critique and refinement record

**Intent:** landing headline → readable paper/annotation → workflow; workspace next writing action → recent work → supporting counts; admin frame → task content.

**Structure pass:** the landing annotation became too narrow at 1024px; it now stacks beneath the sample text. Large headings were reduced to the specified 48px scale. Dashboard counts no longer precede the writing action. Library rows share alignment and preserve previews rather than display raw HTML. Mobile status badges initially squeezed long titles into narrow columns; they now follow the title on a separate row.

**Finish pass:** sidebar branding initially produced an 85px header beside a 64px topbar; truncation with a full-name tooltip restores alignment. Secondary actions use a soft teal treatment. Focus rings are solid rather than low-opacity. Controls meet the 44px mobile target. The decorative development indicator is disabled only under `SLLP_VISUAL_TEST=1`, preserving normal developer tooling.

**Resilience pass:** inspected desktop/mobile/intermediate/narrow English and Chinese captures, long titles, the open account disclosure, mobile drawer, 420px sidebar and a long modal form. Tests verify real language clicks/reload, drawer/modal focus containment and return, keyboard/pointer sizing, API failures, preserved rows on retry and URL-backed tabs. The modal test exposed lost focus after conditional unmount; explicit focus restoration fixed it.

**Measured token contrasts:** body on white 12.28:1; muted text on canvas 5.69:1; white on teal action 5.47:1; teal on soft teal 4.82:1; input border on white 3.93:1; accent on navy 7.82:1. These spot checks do not establish whole-product accessibility compliance.

**Remaining scope:** admin bodies are not final references yet. Actual browser zoom, screen-reader checks and live-backend smoke checks remain outstanding. Full before/after comparisons must use the documented baseline limits. Regenerate changed-state images and inspect them after future UI edits; do not treat a successful screenshot write as visual review.

## Writing surface T05

- `T05-editor-{1440,1024,390,320}-{en,zh}.png`: fictional Basic learner, autosave off, populated unsaved writing, disclosures closed. The title and body use the same paper edge; the primary review action remains visible.
- `T05-options-{1440,1024,390,320}-{en,zh}.png`: same draft, both Writing options and More formatting expanded. These are reachable production controls, not mockups.
- Reference: V02. Paper width 760px maximum, 18px/30px body, 32px desktop and 20px mobile inner gutters. Full-page captures demonstrate content beyond the first viewport; the 900/844px viewport height must not be mistaken for the taller image height.
- Structure pass: removed nested title/editor cards and separated task actions from formatting. Advanced controls remain in labelled native disclosures with ordinary keyboard traversal. Desktop actions align with the paper; narrow actions wrap.
- Finish pass: initial mobile title was clipped in a single-line input. It now wraps at 24px and grows with the title. Sidebar/header and paper use the established navy/teal tokens. Primary formatting retains 44px targets on narrow screens and 40px on desktop.
- Resilience pass: inspected 1440px English, 1024px Chinese, 390px English and 320px Chinese with expanded controls after correction. Automated checks cover all eight viewport/language combinations, all 14 advanced controls fitting the viewport, translated editor labels, generation/language discoverability, and absence of duplicate extension warnings. Interaction checks exercise bold, undo/redo, heading, link and clear formatting. The persistence suite verifies pending locks, save failures, retry and unchanged-original protection.
- Evidence correction: initial full-page mobile captures were taken after the browser scrolled the editor into view. Their fixed header/skip-link positions were capture artifacts. Recaptured after clearing focus and scrolling to the top; the images here are the corrected captures.
- Remaining gaps: real mobile on-screen keyboard, browser UI zoom, assistive technology and live-backend checks remain T13. Browser Back/Forward limitation is explicit in the T04 execution entry. These screenshots are implemented/verified references, not user approval.

## Feedback and revision T06

- `T06-feedback-{1440,1024,390,320}-{en,zh}.png`: fictional reviewed composition, one complete structured suggestion, full assessment retained in its disclosure.
- Intent: assessed writing → specific next improvement → independent revision. At a content width of 960px or more, paper and feedback share the top edge in a 55/45 split. At smaller content widths, they stack and expose jump links. No fixed 420px feedback column squeezes the writing.
- Structure/finish: inspected desktop English, intermediate Chinese, mobile English and 320px Chinese. The paper preserves readable paragraphs; annotations distinguish criterion, recommendation, example, learning tip and evidence without nesting every field in a card. The initial inspection exposed raw source enums and English-formatted dates in Chinese; localized those metadata fields and recaptured.
- Resilience: all eight viewport/locale combinations are checked for overflow and actual content-width layout. Separate browser scenarios exercise missing suggestions, unavailable-language suggestions, legacy text, hostile HTML/URLs, unknown progress stages, generation pending/failure/GET retry, revision uncertainty, source links, deletion cancellation and admin read-only context. Full feedback remains accessible.
- Measurement correction: the first desktop geometry check sampled a transient pre-stylesheet layout. The final computed columns are 585.188px / 478.812px at 1088px content width, with a 24px gap. Tests wait for the final layout rather than weakening its required geometry.
- Remaining gaps: real keyboard/zoom/assistive technology/live-backend checks remain T13. The body baseline limits in the initial evidence index still apply; no pre-redesign feedback screenshot is claimed.
