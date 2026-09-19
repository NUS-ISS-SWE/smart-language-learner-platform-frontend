# How to achieve the intended visual quality

**Current direction (18-19 September):** follow [the implementation addendum](VISUAL_IMPLEMENTATION_20260919.md) for the warmer canvas, editorial typography, 860px writing wrapper and compact controls. Existing screenshot references describe the earlier pass; new browser verification remains pending in an isolated server environment.

Read with the [design specification](DESIGN_SPEC.md), which owns exact tokens and screen requirements. This guide explains composition and craftsmanship: how to turn those specifications into a coherent interface. The [handoff approval boundary](../../UX_REDESIGN_PLAN.md) still applies. The diagrams below are planning blueprints, not rendered mockups or evidence of completed implementation.

## 1. The visual result to aim for

The writing itself should be the most inviting object on the screen. A soft neutral canvas surrounds a clearly defined white paper surface. Navy gives structure to headings and navigation. Dark teal marks the next meaningful action. Most of the interface remains quiet enough that a paragraph of composition text has room to breathe.

The public page should express the same identity through a carefully composed example of writing and feedback. Administration uses the same typography, controls and spacing, with denser rows where comparison matters. The finished product should feel like one application even when moving between public, learner and admin areas.

Three repeatable visual signatures:

1. **The paper:** readable composition typography, a clear title, generous interior space and a restrained boundary. Reuse its appearance in the editor, reviewed composition and landing example.
2. **The annotation:** a small criterion/priority label followed by a specific recommendation, then quieter supporting evidence. Use a subtle teal edge or marker when useful; avoid enclosing every line in another card.
3. **The frame:** navy navigation, a consistent content inset, one aligned page header and a stable location for actions. Keep the frame visually quieter than the task it contains.

Quality comes from the relationship between these elements. Applying the right hex values to a wall of equally weighted cards is insufficient.

## 2. Composition rules

- Establish a reading order before styling: page purpose -> primary task -> working content -> supporting information -> secondary actions. Draw this order in the task notes and compare it with the actual first viewport.
- Align related elements to shared vertical edges. Page title, tabs and list/table edge should line up. Inside paper, the title and first paragraph share a text edge. Avoid slightly different padding at each nested level.
- Use space to communicate grouping: 8-12px within a tight group, 24px between groups, 32-48px between major sections. Use the design scale; adjust the group structure before adding arbitrary margins.
- Let actual content set heights. A recent-work row can grow for a Chinese title; a feedback card can grow for an example. Equal-height cards are appropriate only when their content and purpose are comparable.
- Use solid teal primarily for the main action. Secondary controls should remain clearly visible with lower emphasis. Do not hide useful actions to obtain a cleaner screenshot.
- Distinguish selected, hover, focus and disabled states. A row hover is a subtle surface change; keyboard focus is a visible outline; selection includes a persistent marker and label/state semantics.
- Keep quiet regions genuinely useful: margin around writing improves reading; an oversized empty hero or blank dashboard pushes useful content away. Fix content placement before filling space with illustration or more cards.
- Set text widths deliberately. Landing supporting copy should form a short paragraph, not a single very long line. Do not insert hardcoded `<br>` tags to force an English headline wrap that breaks Chinese or mobile.

## 3. Three representative screen blueprints

Implement these within their scheduled tasks after approval. Inspect their real rendered appearance and use the accepted internal references to guide the remaining screens. Do not create a separate fake product or a permanent demo route to satisfy this guide.

### V01: Landing hero

At 1440px use the existing max-width 1280px container with 32px internal gutters. Header is approximately 64px. Hero vertical padding starts at 64px. Use a 48px column gap and roughly 45/55 allocation of the remaining width. These are layout starting points; text and mobile reflow take precedence over a fixed height.

```text
Brand                                      Language   Log in   Create account

  Small writing-context label       +-------------------------------------+
  Make your next                    | Composition example                 |
  draft clearer.                    | Our class planted a garden...       |
                                    |                                     |
  Short supporting paragraph        | Illustrative feedback example       |
                                    | Clarity                             |
  [Create an account]  Log in        | Add one specific observation...     |
                                    +-------------------------------------+

  01 Write or upload      02 Request review       03 Revise
```

The diagram shows signed-out labels; use the auth-aware destinations in S01. The headline is the strongest typography. The preview is the strongest visual object, with readable real text and a clear distinction between composition and annotation. Use one outer paper treatment, a divider and a soft annotation area. Keep both parts within the layout flow; avoid floating overlap that breaks at intermediate widths.

At 390px: header wraps or compacts without clipping the brand/actions; hero becomes copy -> actions -> preview, with 32px vertical separation and 16px page gutters. The preview's composition and annotation stack inside the same surface. Keep body text readable instead of scaling down the desktop preview as an image. The three workflow steps stack with simple number markers. No decorative stock image is required.

### V02: Writing screen

At 1440px with the default 280px sidebar, available main width is 1160px. A 760px paper centered inside it leaves approximately 200px on each side, including main gutters. The topbar spans the main region. The writing heading/action group should align to the paper width rather than leaving actions at a distant viewport edge.

```text
Navy sidebar | Topbar / account / language
             |
             |       New composition          Saved   Save  [Request review]
             |       +----------------------------------------------------+
             |       | Title                                              |
             |       | Formatting controls         More writing options   |
             |       | -------------------------------------------------- |
             |       | First paragraph of the composition...              |
             |       |                                                    |
             |       | Next paragraph...                                  |
             |       +----------------------------------------------------+
```

Use one paper boundary, not title-card + toolbar-card + editor-card + action-card. Title and writing body carry the attention; formatting controls use compact grouping and separators. The visible save state must remain distinguishable from the Save action. Put optional generation/autosave controls in the documented secondary group without dropping them.

On narrow screens, place actions on their own wrapping row, keep the input at the specified readable size, and group toolbar overflow accessibly. Never make the editor horizontally scroll to expose essential actions. Test a focused paragraph with the mobile keyboard and any sticky action rail; do not rely only on a screenshot with an unfocused editor.

### V03: Admin users

Use the common navy frame. Align heading, filters, table and pagination to one content edge. Main content padding is 32px desktop. Keep the heading above one filter toolbar; place the table in one white surface. Use row dividers and column alignment instead of a card for every cell.

```text
Navy sidebar | Users
             | Manage learner accounts
             |
             | Search name/email...       Role       Status     Clear
             | +-------------------------------------------------------+
             | | Name / email        Role          Status       Actions|
             | | Mei Tan             Basic         Active       View   |
             | | Fictional account   Premium       Suspended    View   |
             | +-------------------------------------------------------+
             |                                       Previous   Next
```

Names are stronger than email metadata; status is a small labelled badge, not a large colored panel. Keep comparable actions in the same column and numeric values right-aligned where used. On mobile, filters stack and table overflow remains local and labelled. Use the same form, badge and dialog treatments on rubrics, pricing and metrics. Administrative density may differ from writing density without changing the visual language.

## 4. Assets, illustration and charts

- Build the paper/feedback preview with actual HTML, CSS and shared primitives so text remains crisp, accessible, translatable and responsive. No screenshot of text embedded as the hero UI.
- Reuse the existing logo/brand treatment and Lucide icons. Keep one icon style and consistent size. Do not introduce emoji or unrelated icon packs as visual filler.
- Do not add stock photos, generated decorative artwork or a new font merely to make the page look more designed. They are unnecessary for the chosen direction. If a later user request calls for an illustration, give it an explicit purpose, placement, responsive crop and accessible treatment before producing it. Image generation cannot replace a functional UI.
- Charts use the same restrained palette, clear axes and stable legend order. Distinguish series beyond color when needed. Preserve all metrics and provide the required data alternative. Do not smooth, truncate or manufacture data for a more attractive chart.
- Empty states should usually need a small relevant icon, a specific sentence and the next action. Loading skeletons should resemble the layout they replace and must never become permanent decorative content.

## 5. Required render-inspect-refine procedure

After implementation approval, follow this procedure for every visual task. Work on the live application with fictional test data and its real components. Inspect images using an available browser/image-viewing tool; screenshot generation alone is not inspection.

**Pass 1 - structure.** Render desktop and mobile early, before fine decoration. Inspect the reading order, main action, column widths, content density and shared alignment. Note the three largest concrete defects, or record why none are present. Fix structural defects before polishing borders. Example: "At 1024px the 420px sidebar leaves feedback too narrow; stack by available content width."

**Pass 2 - finish.** Inspect at normal reading size and enlarged detail. Check typography/wrapping, spacing rhythm, text contrast, icon alignment, button height, row padding, border/shadow consistency and hover/focus states. Compare the shared header, buttons and paper against the reference screens. Fix visible inconsistencies in the primitive when shared, and in the page when local. Example: "The filter inputs are 4px taller than the search field; use the same field size variant."

**Pass 3 - resilience.** Inspect long titles, Chinese, empty/loading/error states, disabled/pending actions, open menus/dialogs, sidebar extremes, 320px width and 200% zoom according to the execution matrix. Verify keyboard and mobile interaction. Re-capture affected views after fixes. A polished default state is insufficient if errors or translated content break it.

Repeat only the affected pass when fixes reveal new issues. A first pass can succeed; do not make arbitrary changes to satisfy an iteration count. Never write "looks good" without observations. If the environment prevents rendering or image inspection, record visual quality as unverified and the precise missing check; do not claim equivalent quality from source review alone.

## 6. Weak outcomes and concrete corrections

| Weak outcome                                        | Required correction                                                                                                                                       |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A grid of equally prominent dashboard cards         | Establish a writing entry point and recent work first; move supporting subscription/summary information to lower-emphasis regions while retaining access. |
| Attractive colors, but cramped composition text     | Restore paper width, body size, line height and interior padding before adjusting decoration.                                                             |
| Huge hero title and an empty skeleton drawing       | Use the specified headline scale and the readable composition/annotation example; balance column widths and whitespace.                                   |
| Every feedback field in a separate bordered box     | Group recommendation, example and evidence by typography and spacing inside the suggestion structure. Keep the complete information.                      |
| Mobile is a miniature desktop screen                | Reflow columns and actions, preserve readable type and touch targets, retain controls in accessible groups.                                               |
| Admin pages look like a different product           | Reuse shell, fields, badges, dialogs and spacing; vary density deliberately, not colors or component language.                                            |
| Screenshot looks clean because actions were removed | Restore the capability; find a labelled secondary location and verify discoverability.                                                                    |
| Animation or imagery distracts from writing         | Remove the distraction and improve content composition; no decorative effect is required for completion.                                                  |

## 7. Evidence that transfers judgment to the next agent

Save this compact record with each task's execution entry:

```text
Visual intent: what the user should notice first, second and third.
Reference: blueprint V01/V02/V03 or an established screenshot path.
Inspected views: viewport, language, role, content and interaction state.
Observed defects: concrete location and effect; avoid generic adjectives.
Corrections: what changed and why; distinguish shared vs local fixes.
Recheck: screenshot paths and interaction results after the corrections.
Remaining gaps: explicit, or none found in the inspected scope.
```

For the first three representative screens, keep full-page and first-viewport screenshots where useful; record dimensions, fixture, language and commit. Future agents compare against those artifacts instead of relying on memory or inventing a fresh interpretation. Mark screenshots as implemented/verified unless the user actually approved them. User approval is not required for every iteration once implementation scope is authorized.

The target is the same design direction and evidence standard across models, not an unsupported promise of pixel-identical output. The [evidence index](evidence/README.md) now contains inspected landing, workspace and writing references. Use those rendered references alongside the blueprints; admin bodies still await their scheduled redesign.
