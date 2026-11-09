# Architecture

## Implemented through Phase 3

`src/main.tsx` mounts React in Strict Mode. `app/App.tsx` composes the persistent desktop, fixed MenuBar and Dock, and WindowManager under WindowManagerProvider. DesktopHero, PhotoWidget, CurrentlyWidget, and QuickLinksWidget retain the Phase 1 layout and typed configuration in `data/desktop.ts`. No full-page navigation occurs.

Vite integrates React and Tailwind with `/` as the asset base. `styles/global.css` defines semantic theme tokens and the shared menu/dock geometry and layer variables. System sans-serif and monospace stacks avoid font downloads. The real photograph and current Resume file are still pending.

## Application registry

`data/apps.ts` is the single source of truth for the six stable IDs, exact display names, icon configurations, launch kind, single-instance policy, window size presets, expansion support, and temporary placeholder messages. `dockOrder` fixes navigation order. Home has no window. The internal `jarvis` ID displays **Beyond the Data**, which will host JARVIS; `contact` displays **Let's Grab a Coffee**.

Normal preferred sizes are Projects 850×560, Beyond the Data 760×500, Technical Skills 700×520, Education 420×content height, and Let's Grab a Coffee 440×content height. Expanded maxima are 1100×740, 1000×700, and 950×700 respectively for the first three. Education and Let's Grab a Coffee have disabled expansion controls. All preferred sizes are constrained to available space.

## Window state and lifecycle

`app/windowState.ts` contains a pure reducer. Open instances form a back-to-front array with application ID, unique lifetime ID, minimized flag, and expanded flag. Absence means closed. The active application is derived from the last non-minimized instance, falling back to Home; it is not duplicated in separate state. A focus-request counter distinguishes requests to refocus an already-active application.

`WindowManagerProvider` exposes `openApp`, `closeApp`, `minimizeApp`, `restoreApp`, `focusApp`, `toggleExpand`, and `showDesktop` through `useWindowManager`. Launching an existing application restores and raises its single instance. Closing removes it, while reopening allocates a fresh lifetime ID and resets expansion. The lifetime ID is the React key, so even immediate reopening during an exit animation mounts fresh content.

Minimizing and Home keep application content mounted. Minimized windows become inert and inaccessible immediately, fade out, then become visually hidden. Their content and expansion state survive. Home minimizes all windows without removing them. Closing or minimizing the front window selects the next visible one, or Home.

WindowManager renders instances in stable lifetime order and applies centrally derived stacking indices from focus order. Changing focus therefore changes layers without moving pressed controls in the DOM. This avoids losing pointer clicks when a background window is raised. No event bus, global state library, persistence, dragging, or manual resizing is implemented.

## Rendering, bounds, focus, and animation

`AppWindow` supplies non-modal dialog semantics, shared title bar, WindowControls, internal scrolling, and active-window emphasis. The workspace is fixed between the shared menu and dock reservations, with small edge gutters. Every window is centered within that area, with CSS maximum dimensions limiting it on short/narrow viewports. A single isolated window layer sits below dock and menu layers; internal indices never grow without bound.

Opening/restoring focuses the active window. Closing/minimizing focuses the next visible window or desktop. Pointer and keyboard focus inside a background window raise it without stealing focus from its controls. Ordinary windows do not trap focus; Tab may move between windows, desktop links, and Dock. Narrow-screen window controls are 44×44px.

Installed Motion handles 180ms opacity/scale entrance, exit, minimize, and restore transitions. CSS transitions preferred width/height over 200ms without moving the desktop. [Motion reduced-motion support](https://motion.dev/docs/react-use-reduced-motion) and CSS media queries disable movement/transitions when requested. Exiting windows are inert while their visual exit finishes.

## Dock and menu integration

Dock's shared `(ApplicationId) => void` launch callback now calls `openApp`; Home dispatches Show Desktop through the same boundary. All six actions are supported. Running IDs come from all open instances, including minimized ones, and exclude Home. The menu reads the active name from the same registry. Its existing isolated browser-local clock remains unchanged, with minute-boundary updates and visibility resynchronization.

DockIcon still supports Lucide glyph compositions or a replaceable custom asset. Existing 180ms hover/focus feedback, labels, Escape dismissal, reduced-motion support, and small-screen targets are preserved.

## Temporary content and future applications

`ApplicationPlaceholder` reads each application's registry name, icon, and development message. These are infrastructure verification placeholders only; no application features are implemented. Replace its use in WindowManager with real content in the relevant phase, preserving AppWindow and its lifetime key.

Future content belongs in `apps/`: Projects uses the Finder-inspired explorer, Education summarizes education, Technical Skills groups technologies, Let's Grab a Coffee provides contact information, and Beyond the Data hosts JARVIS. Typed records in `data/` will provide shared project, education, skill, and contact facts. Application-local state belongs inside each app and survives minimizing through the existing mount policy. Apps can use the same controller hook to open/focus other applications.

## Planned routes and incremental delivery

Add React Router in Phase 7 for reports, preferably hash URLs such as `/#/projects/example` that survive GitHub Pages reloads without server rewrites. Keep the desktop/controller mounted above routed content. URLs describe shareable content; in-memory window state describes focus, visibility, and expansion. Reload currently starts a fresh desktop session.

No backend, database, AI service, or deployment workflow is added. Each phase remains independently reviewable with TypeScript, ESLint, production builds, relevant browser checks, and focused lifecycle tests.
