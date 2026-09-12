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

**Remaining scope:** editor and admin bodies are not final references yet. Actual browser zoom, screen-reader checks and live-backend smoke checks remain outstanding. Full before/after comparisons must use the documented baseline limits. Regenerate changed-state images and inspect them after future UI edits; do not treat a successful screenshot write as visual review.
