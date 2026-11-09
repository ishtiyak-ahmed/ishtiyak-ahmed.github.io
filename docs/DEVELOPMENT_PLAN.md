# Development plan

Complete one phase per request. Run `npm run typecheck`, `npm run lint`, and `npm run build` after each phase; inspect relevant browser behavior and responsive layouts. Add focused automated tests when stateful behavior makes them valuable. Fix failures before moving forward. These checks do not authorize a push or deployment.

| Phase | Deliverable | Dependencies | Acceptance checks |
| --- | --- | --- | --- |
| 0 — Project Initialization | Vite/React/TypeScript setup, theme tokens, minimal message, documentation, local rebuild branch | Existing repository history | Install, typecheck, lint, build, and render the placeholder; verify root asset base and unchanged remote |
| 1 — Desktop Foundation | Desktop shell, exact introduction, photo placeholder, Currently, horizontal Quick Links, menu/dock spacing | 0 | Verify 1440px/1920px and narrow layouts, small widget proportions, link destinations and disabled Resume, keyboard labels, and no overflow |
| 2 — Dock & Menu Bar | Six ordered application icons, typed registry, launch boundary, fixed menu with local live clock | 1 | Verify all five requested viewport sizes, hover/focus labels and Escape, Home focus, guarded unavailable apps, minute updates, no fake running indicators, no overflow or content overlap |
| 3 — Window Manager | Reducer/context, shared controls, single-instance lifecycle, preset expansion, registry placeholders | 1–2 | Open/raise/close/minimize/restore/Home, instance preservation/reset, focus fallback and background controls, dock indicators, active menu name, all five viewport bounds; no dragging/resizing |
| 4 — Education & Coffee | Compact real apps, centralized education data, shared canonical contact destinations | 3 | Program facts and graduation fallback, official-logo placeholder, ordered actions and missing-details states, safe external links, copy outcomes, all five viewport sizes and full existing lifecycle |
| 5 — Technical Skills | Categorized skills application | 3; reuse patterns from 4 | Correct grouping, responsive content, window integration |
| 6 — Projects Finder | Data-driven project explorer | 3; reuse application patterns | Project selection, navigation, empty states, shared project records |
| 7 — Project Reports | Shareable project report views and router integration | 6 | Direct hash URL, reload, back/forward, unknown slug, persistent desktop state |
| 8 — JARVIS | Terminal-style deterministic command interpreter | 3, 6–7 and shared portfolio data | Documented commands, invalid input, history, accessible output, shared controller actions; no AI |
| 9 — Polish & Deployment | Accessibility, responsive behavior, subtle visual effects/animation where useful, Pages publishing | 1–8 | Keyboard and reduced-motion checks, performance, production preview, root asset paths, direct routes, then separately authorized deployment |

Do not introduce UI for later phases during earlier ones. Stages 4 and 5 both depend on the window manager; the listed order keeps application patterns consistent. Project reports and JARVIS follow the project data so they reuse a single source of truth.

The original published site remains live throughout the rebuild. Review branch changes before the later merge/deployment decision. Add GitHub Pages automation only in Phase 9; do not copy old deployment behavior into the rebuild.

Phases 0–4 are implemented. Phases 0–3 have local checkpoint commits; Phase 4 remains uncommitted for review. Phase 5 has not started.

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
- Pending: a verified official university logo, an explicitly approved public graduation date, a current résumé PDF, and a verified phone number. The existing personal photograph placeholder also remains. These omissions have visible accessible fallbacks; no invented details or broken links are exposed.
