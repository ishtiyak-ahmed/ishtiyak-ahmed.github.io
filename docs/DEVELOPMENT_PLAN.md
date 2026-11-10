# Development plan

Complete one phase per request. Run `npm run typecheck`, `npm run lint`, and `npm run build` after each phase; inspect relevant browser behavior and responsive layouts. Add focused automated tests when stateful behavior makes them valuable. Fix failures before moving forward. These checks do not authorize a push or deployment.

| Phase | Deliverable | Dependencies | Acceptance checks |
| --- | --- | --- | --- |
| 0 — Project Initialization | Vite/React/TypeScript setup, theme tokens, minimal message, documentation, local rebuild branch | Existing repository history | Install, typecheck, lint, build, and render the placeholder; verify root asset base and unchanged remote |
| 1 — Desktop Foundation | Desktop shell, exact introduction, photo placeholder, Currently, horizontal Quick Links, menu/dock spacing | 0 | Verify 1440px/1920px and narrow layouts, small widget proportions, link destinations and disabled Resume, keyboard labels, and no overflow |
| 2 — Dock & Menu Bar | Six ordered application icons, typed registry, launch boundary, fixed menu with local live clock | 1 | Verify all five requested viewport sizes, hover/focus labels and Escape, Home focus, guarded unavailable apps, minute updates, no fake running indicators, no overflow or content overlap |
| 3 — Window Manager | Reducer/context, shared controls, single-instance lifecycle, preset expansion, registry placeholders | 1–2 | Open/raise/close/minimize/restore/Home, instance preservation/reset, focus fallback and background controls, dock indicators, active menu name, all five viewport bounds; no dragging/resizing |
| 4 — Education & Coffee | Compact real apps, centralized education data, shared canonical contact destinations | 3 | Program facts and graduation fallback, official-logo placeholder, ordered actions and missing-details states, safe external links, copy outcomes, all five viewport sizes and full existing lifecycle |
| 5 — Technical Skills + Experience Registration | Categorized toolkit, accessible descriptions, sourced icons, confirmed graduation/phone, Experience registry/dock entry | 3–4 | Exact skill list and categories, popovers on hover/focus/tap, shared contact data, clipboard outcomes, seven-icon dock, Experience lifecycle, all viewport bounds |
| 6 — Experience Application | Mail-inspired position list and selected-role detail split view | 5; verified work-history content | Multiple roles, selected role details, keyboard navigation, window lifecycle; no invented employers or accomplishments |
| 7 — Projects Finder | Data-driven project explorer | 3, 5; verified project records | Project selection, navigation, empty states; add verified skill-to-project references only when supported |
| 8 — Project Reports | Shareable reports and hash-route integration | 7 | Direct hash URL, reload, back/forward, unknown slugs, persistent desktop |
| 9 — JARVIS | Deterministic portfolio command interpreter | 6–8 and shared portfolio data | Valid/invalid commands, history, accessible output, shared launching including Experience; no AI |
| 10 — Visual Redesign & Motion Polish | Comprehensive visual identity and motion refinement | 1–9 | Responsive visual review, keyboard/reduced motion, consistent surfaces and artwork |
| 11 — Final Content, QA & Deployment | Approved content, regression QA, Pages publishing | 1–10 | Performance, production preview, root assets/direct routes, then separately authorized deployment |

Do not introduce UI for later phases during earlier ones. Stages 4 and 5 both depend on the window manager; the listed order keeps application patterns consistent. Project reports and JARVIS follow the project data so they reuse a single source of truth.

The original published site remains live throughout the rebuild. Review branch changes before the later merge/deployment decision. Add GitHub Pages automation only in Phase 11; do not copy old deployment behavior into the rebuild.

Phases 0–8 are implemented. Phases 0–7 have local checkpoint commits; Phase 7 was reviewed and checkpointed as `41a28f8` before Phase 8. Phase 8 remains uncommitted for review; Phase 9 has not started.

## Phase 3 verification

- `npm test`: eight dependency-free reducer tests cover single instances, focus order, expansion policy, Home, minimized restoration, fresh close/reopen lifetimes, focus fallback, and stale actions. Tests are included in strict TypeScript checking.
- Browser lifecycle checks: one window per app; real indicators; background focus and controls; all three expansion toggles; disabled Education/Coffee expansion; Home preserving five instances; keyboard access without trapping focus; close/minimize selecting the next window or Home.
- Layout: 1920×1080, 1440×900, 1280×800, 390×844, and 320×640 have no horizontal overflow. Normal/expanded windows remain inside the workspace below MenuBar and above Dock. Small-screen controls retain 44×44px targets.
- Additional short-screen check: internal content scrolling at 320×320 retained its scroll position after minimize/restore and reset to the top after close/reopen.
- Phase 3 used minimal registry-driven development placeholders. Phase 4 replaces only Education and Coffee; the other three remain unchanged.

## Phase 4 verification and pending content

- All 15 tests pass: the original eight lifecycle cases plus education facts/fallback, shared link order/identity, valid/missing destinations, future résumé wiring, and clipboard success/failure/unsupported/missing-number handling.
- Browser checks cover 1920×1080, 1440×900, 1280×800, 390×844, and 320×640. Both windows stay within the workspace, without horizontal overflow. Desktop layouts have no internal scrollbars; the smallest Coffee view scrolls internally to reach Phone.
- Open both, raise Education, minimize/restore it, close/reopen Coffee with a fresh instance, and Home preserving both running apps all pass. Keyboard access reaches enabled contact links. Shared AppWindow and window controls remain unchanged.
- Phase 4 left logo, graduation, résumé, phone, and photograph pending. Phase 5 confirms graduation and phone; the other assets remain outstanding.

## Phase 5 acceptance and remaining content

The toolkit contains only the 18 supplied skills. Nine locally bundled Devicon SVGs and neutral Lucide symbols provide icons without adding a dependency. Descriptions support hover, focus, and click/tap; Escape and outside interaction dismiss them. Related work requires verified IDs, an implemented destination, and a resource-selection handler; no mappings are fabricated.

At the Phase 5 checkpoint, Experience had a real seventh dock action and shared single-instance lifecycle, with only the approved Phase 6 placeholder. Its full split view is not part of Phase 5. Both Technical Skills size states and the seven-icon dock are checked at 1920×1080, 1440×900, 1280×800, 390×844, and 320×640, with at least 44px dock targets and no horizontal overflow. Experience open/expand/minimize/restore/close/reopen, Home, active names, and running indicators are covered by lifecycle tests and browser checks.

The confirmed May 2029 graduation and 437-606-3417 phone come from centralized configuration. Phone has copy feedback and a `tel:` action and remains absent from Quick Links. Clipboard denial/unsupported cases remain automated tests. At that checkpoint, Resume remained disabled because the PDF was unavailable. Phase 6 integrates the subsequently supplied original PDF without modifying it.

Before the next content review: supply the official university logo and personal photograph; review conservative skill descriptions and add only verified project/experience mappings. Phase 6 must use confirmed work-history records.

## Phase 6 verification and pending content

Experience now renders a Mail-inspired split view in the existing window, with stable role IDs, newest-first sorting, optional content, initial selection, independent panel scrolling, and list/detail/Back navigation in narrow windows. Production displays only the confirmed E. Aferi role metadata; no summary or accomplishments are fabricated.

The 30 automated cases retain the original lifecycle coverage and add selection, multiple fixture roles at one employer, defaulting, sorting, missing optional content, empty data, date formatting, link filtering, valid resource IDs, and repeated role-selection requests. An isolated browser harness checks actual rendering, switching, independent scroll, selection/scroll preservation under minimize and expansion, reset after close, compact keyboard focus, and empty states. Test fixtures and harness HTML are excluded from production builds.

Production checks cover 1920×1080, 1440×900, 1280×800, 390×844, and 320×640 at normal/expanded sizes. No horizontal overflow or menu/dock obstruction is allowed. Previous Education, Coffee, Skills, Home, focus/stacking, and running indicators remain regression checks.

The supplied `Ishtiyak_Ahmed copy.pdf` is found and copied unchanged into the shared public résumé path. Both résumé links are enabled and open a new tab; verify the production PDF matches the source. The original root file is not changed.

Pending content review: role summary and accomplishments, verified technologies/project mappings, official university logo, personal photograph, and final skill descriptions. Proceed to Phase 7 only with a new prompt.

## Phase 7 acceptance and pending content

Projects now uses a single Finder window with Projects-only sidebar, root/project breadcrumbs, bounded Back/Forward history, explicit accessible Open actions, selection, list/grid views, and global title/description search. Existing window controls, sizes, focus, indicators, minimize/restore, and reset-on-close are preserved. Requests through `openApp('projects', projectIdOrPath)` use the same optional request boundary as Experience and ignore invalid destinations.

Currently is positioned upper-right below the clock, outside the menu. Photo and its aligned Quick Links remain upper-left; hero wording, dock order, menu bar, and widget configuration are unchanged. Narrow layouts retain flowing readable widgets. This phase contains no broader visual redesign.

The 43 automated tests include the existing 30 and 13 Finder scenarios, with isolated fixture projects rather than fictional production data. Browser checks cover 1920×1080, 1440×900, 1280×800, 390×844, and 320×640, normal/expanded bounds, menu/dock clearance, widget placement, explicit mobile opening, navigation, keyboard opening, search/empty states, view switching, resources, and lifecycle. Test-only harness pages must stay outside the production bundle.

Production contains only the three confirmed project names. TTC's supplied case study is the sole resource (HTTP 200 verified); other folders show pending information. Before Phase 8, supply approved descriptions/reports and any verified repository, demo, documentation, or dashboard destinations. Add related skill mappings only when confirmed. Phase 8 will connect hash URLs to stable slugs using the existing resolver; a routing dependency is not assumed. No push, deployment, or Phase 7 commit is authorized.

Final Phase 7 checks: strict TypeScript, ESLint, all 43 tests, and production build pass. Browser console contains no warnings/errors. The external TTC resource opens the real case study in a new tab. Production excludes test harnesses/fixture markers, and the source/public/build résumé hashes match.

## Phase 8 acceptance and content boundaries

Implemented the reusable report schema/template, explicit publication states, centralized safe resource handling, and GitHub Pages-compatible hash routes without dependencies. Finder remains an OS application; report resources open separate webpages in new tabs. TTC retains its existing external report. JavaFX and Tree have unavailable report states; no filler case studies, new portfolio projects, metrics, screenshots, or repository links are published.

Supported routes are desktop `/#/`, Finder root `/#/projects`, known folder `/#/projects/:slug`, and report `/#/reports/:slug`. Folder URL changes use browser history; Back/Forward and refresh reapply stable project IDs in the existing single Finder instance. Transient actions do not create history. Unknown routes provide recovery; known unpublished reports show factual availability. Existing in-window Finder history and lifecycle remain intact.

Acceptance covers strict TypeScript, ESLint, 54 automated tests (all original 43 preserved), and production build. New tests cover publication/data filtering, missing media/optional sections, URL helpers, route validation, single-instance synchronization, history writes, and source exclusion of fixtures. Browser verification checks actual internal report rendering/new-tab opening using an isolated fixture, real external TTC loading, direct links/refresh, Back/Forward, invalid recovery, cross-app requests, lifecycle, existing apps, and responsive Finder/report bounds at 1920×1080, 1440×900, 1280×800, 390×844, and 320×640.

Before publication: obtain approved report prose and media for JavaFX/Tree, verified source/demo/documentation destinations, and confirmed skill/experience relationships. Add approved content to each existing project's report field; register real public media paths and rerun rendering/build checks. Unfinished reports remain unavailable. Final writing is separately reviewed; visual redesign remains Phase 10, final QA/deployment Phase 11. No Phase 8 commit, push, deployment, or Phase 9 work is authorized here.
