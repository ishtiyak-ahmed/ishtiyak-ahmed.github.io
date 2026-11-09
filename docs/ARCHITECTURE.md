# Architecture

## Implemented in Phase 0

`src/main.tsx` mounts React in Strict Mode and imports `styles/global.css`. `app/App.tsx` renders only the initialization message. Vite integrates React and Tailwind, using `/` as the asset base. Global theme variables expose the requested graphite palette as both CSS variables and Tailwind utilities. System sans-serif and monospace stacks avoid font downloads.

Everything below is a plan. No controller, window system, router, application registry, or content model is implemented yet.

## Persistent desktop and applications

`app/` will compose a persistent desktop shell and a central OS controller. Desktop surfaces and widgets belong in `components/desktop/`; shared window chrome belongs in `components/windows/`; small reusable controls belong in `components/ui/`.

Feature UI stays inside `apps/`: Finder explores projects, Education summarizes education, Skills groups technologies, Coffee provides contact information, and JARVIS interprets a fixed set of portfolio commands. Project report components can live with Finder initially; introduce a separate module only when the actual content warrants it.

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
