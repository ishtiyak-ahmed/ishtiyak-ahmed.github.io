# Development plan

Complete one phase per request. Run `npm run typecheck`, `npm run lint`, and `npm run build` after each phase; inspect relevant browser behavior and responsive layouts. Add focused automated tests when stateful behavior makes them valuable. Fix failures before moving forward. These checks do not authorize a push or deployment.

| Phase | Deliverable | Dependencies | Acceptance checks |
| --- | --- | --- | --- |
| 0 — Project Initialization | Vite/React/TypeScript setup, theme tokens, minimal message, documentation, local rebuild branch | Existing repository history | Install, typecheck, lint, build, and render the placeholder; verify root asset base and unchanged remote |
| 1 — Desktop Foundation | Persistent desktop shell, background, layout boundaries | 0 | Desktop fills viewport and adapts to narrow screens; shell stays mounted |
| 2 — Dock & Menu Bar | Six navigation icons, OS/application labels, live clock | 1 | Keyboard access, labels, clock updates and timer cleanup; use callbacks until the window manager exists |
| 3 — Window Manager | Shared chrome and central open/focus/close/minimize/restore behavior; geometry as needed | 1–2 | Multiple windows, focus/stack order, restore, bounds, keyboard access; connect dock actions |
| 4 — Education & Coffee | Compact education and coffee-themed contact applications | 3 | Correct data, readable content, valid contact links, full window lifecycle |
| 5 — Technical Skills | Categorized skills application | 3; reuse patterns from 4 | Correct grouping, responsive content, window integration |
| 6 — Projects Finder | Data-driven project explorer | 3; reuse application patterns | Project selection, navigation, empty states, shared project records |
| 7 — Project Reports | Shareable project report views and router integration | 6 | Direct hash URL, reload, back/forward, unknown slug, persistent desktop state |
| 8 — JARVIS | Terminal-style deterministic command interpreter | 3, 6–7 and shared portfolio data | Documented commands, invalid input, history, accessible output, shared controller actions; no AI |
| 9 — Polish & Deployment | Accessibility, responsive behavior, subtle visual effects/animation where useful, Pages publishing | 1–8 | Keyboard and reduced-motion checks, performance, production preview, root asset paths, direct routes, then separately authorized deployment |

Do not introduce UI for later phases during earlier ones. Stages 4 and 5 both depend on the window manager; the listed order keeps application patterns consistent. Project reports and JARVIS follow the project data so they reuse a single source of truth.

The original published site remains live throughout the rebuild. Review branch changes before the later merge/deployment decision. Add GitHub Pages automation only in Phase 9; do not copy old deployment behavior into the rebuild.
