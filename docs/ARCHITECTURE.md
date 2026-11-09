# Architecture

## Implemented through Phase 2

`src/main.tsx` mounts React in Strict Mode and imports `styles/global.css`. `app/App.tsx` renders `components/desktop/Desktop.tsx`. The desktop composes `DesktopHero`, `PhotoWidget`, `CurrentlyWidget`, and `QuickLinksWidget`, with typed configuration in `data/desktop.ts`. `components/desktop/desktop.css` defines a responsive grid, compact upper-left widgets, a centered introduction, and reserved regions for fixed menu/dock chrome. No window state is implemented. Vite integrates React and Tailwind, using `/` as the asset base. Global theme variables expose the requested graphite palette as both CSS variables and Tailwind utilities. System sans-serif and monospace stacks avoid font downloads.

Currently and Quick Links are data-driven. The photo accepts a source, alt text, and crop position; without a source it renders a neutral placeholder. Lucide supplies general icons; two local SVGs supply brand marks not present in Lucide. Missing link destinations render disabled, without anchors.

## Application registry and launch boundary

`data/apps.ts` is the single source of truth for the six application IDs, display names, icon configuration, launch kind, and single-instance metadata. `dockOrder` fixes the navigation order. The internal `jarvis` ID displays **Beyond the Data**; JARVIS will be its terminal application. `contact` displays **Let's Grab a Coffee**. The registry contains no application UI or window state.

`Dock` receives `onLaunch: LaunchApplication`, `availableAppIds`, and optional `runningAppIds`. All actions use the same `(id: ApplicationId) => void` contract. `App` owns the dispatch function; currently it only focuses the desktop and returns the page to the top for Home. The other five buttons remain keyboard-focusable with `aria-disabled`, explanatory tooltips, and guarded click handlers. They neither invoke launch nor change the active application. Availability is a capability supplied by the controller, not a registry fact.

Phase 3 should extend the central dispatcher with real window operations, supply availability from implemented launch support, derive the menu's active name from the focused window and registry, and pass real running IDs. No running indicators are rendered in Phase 2. There is no temporary window implementation to remove.

`DockIcon` maps configured glyphs to Lucide compositions. Each icon can instead use `{ kind: 'asset', src }` without changing Dock. Size, corner radius, tone, and 180ms scale feedback live in `dock.css`; reduced-motion preferences disable transitions and transforms. Dock labels work on hover and keyboard focus and dismiss with Escape. Narrow-screen buttons retain at least 44×44px targets.

`MenuBar` accepts `activeApplicationName`. Its isolated `LocalClock` formats the browser's local date/time with Intl, updates at the next minute boundary, resynchronizes when the page becomes visible, and cleans up its timeout and listener on unmount. This is a client-rendered Vite application, with no server hydration. Clock ticks rerender only the clock. The menu remains 40px tall; narrow layouts now reserve that same height instead of the old empty 24px band.

Everything below is a plan. No window controller, window system, or router is implemented yet.

## Persistent desktop and applications

`app/` will compose a persistent desktop shell and a central OS controller. Desktop surfaces and widgets belong in `components/desktop/`; shared window chrome belongs in `components/windows/`; small reusable controls belong in `components/ui/`.

Feature UI stays inside `apps/`: Projects will provide the Finder-inspired explorer, Education summarizes education, Technical Skills groups technologies, Let's Grab a Coffee provides contact information, and Beyond the Data hosts JARVIS, which interprets a fixed set of portfolio commands. Project report components can live with Finder initially; introduce a separate module only when the actual content warrants it.

## Central controller and window management

Start with React state or a reducer and a context at the shell level. The controller will own application/window identity, open and minimized state, focused window, stacking order, and geometry when dragging/resizing is introduced. Keep transient input and feature-specific state inside each application.

Applications will call a small typed controller API through context, such as open, close, focus, minimize, and restore. Dock actions, Finder project selection, and JARVIS commands will use the same operations. Applications should not manipulate each other's internal state or query the DOM to control windows.

Window rendering and shared chrome will read controller state and report user actions to it. Define precise types when Phase 3 makes these behaviors concrete; do not build an event bus or general-purpose desktop framework in advance.

## Data-driven content

Put typed project, education, skill, and contact records in `data/` as features arrive. Use stable IDs and project slugs so Finder, project reports, and JARVIS can share the same facts. Keep presentation separate from records; bundle imported images in `assets/`, and use `public/` for files requiring stable unchanged URLs. No database, AI service, or backend is planned.

## Routes and persistence

Add React Router when Phase 7 introduces project reports. Prefer a hash router with desktop `/` and report `/projects/:slug` routes (URLs such as `/#/projects/example`). GitHub Pages serves the root HTML for these URLs, so reloads work without server rewrites. Validate unknown slugs and provide a way back to the desktop.

Keep the desktop/controller mounted above the route content so navigation does not discard window state. URLs describe shareable content, while in-memory controller state describes window layout and focus. Browser refresh may reset window layout initially; add local persistence only if later requirements call for it.

## Incremental delivery

Each phase adds a narrow capability to the existing shell. Reserved folders establish ownership without placeholder components. Shared abstractions follow demonstrated needs; dependencies beyond the requested foundations are deferred. Phase-specific manual checks plus TypeScript, linting, and production builds keep each step independently reviewable.
