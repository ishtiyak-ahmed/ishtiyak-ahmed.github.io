# Ishtiyak OS

A macOS-inspired personal portfolio built incrementally. Phase 6 adds a responsive, Mail-inspired Experience application and integrates the supplied résumé. Experience currently shows one confirmed role; detailed wording remains pending review.

## Stack

React, TypeScript (strict), Vite, and Tailwind CSS through its Vite plugin. Lucide React supplies general widget icons; Motion provides restrained window lifecycle animations. ESLint checks TypeScript and React conventions. No backend or external font service is required.

## Local development

Use Node.js 22.13+ on the 22.x line, or Node.js 24+ (a supported LTS release is recommended), and npm 10+. These versions satisfy both Vite and ESLint.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. System fonts provide a native sans-serif UI and a dedicated monospace stack for the future terminal.

```sh
npm run typecheck  # Strict TypeScript checks for app and Vite config
npm run lint       # ESLint
npm test           # Dependency-free lifecycle, configuration, and clipboard tests
npm run build      # TypeScript checks, then production output in dist/
npm run preview    # Serve the production build locally
```

## Structure

```text
public/                  Static files copied without transformation
src/
  main.tsx               React entry point
  app/App.tsx            Persistent shell, controller context, window reducer
  components/
    desktop/             Desktop, hero, Dock, DockIcon, MenuBar, CSS
      widgets/           Photo, Currently, Quick Links
    windows/             WindowManager, AppWindow, controls, placeholder, CSS
    ui/                  Small local brand icon SVGs
  apps/
    finder/              Future project explorer
    jarvis/              Future deterministic portfolio terminal
    education/           Education information panel
    experience/          Split-view work history and local selection
    skills/              Categorized toolkit and accessible skill descriptions
    coffee/              Coffee-themed contact application
  data/                  Desktop, education, contacts, skills, application registry
  hooks/                 useWindowManager controller hook
  styles/global.css      Tailwind import, tokens, global base styles
  assets/icons/skills/    Local technology SVGs, license, source manifest
  assets/images/         Future image assets
docs/
  ARCHITECTURE.md
  DEVELOPMENT_PLAN.md
```

Unused reserved directories contain only `.gitkeep`; they have no implementation yet. Root configuration includes `vite.config.ts`, the `tsconfig*.json` project references, and `eslint.config.js`. `package-lock.json` fixes the dependency resolution for `npm ci`.

## Roadmap

0. Project Initialization
1. Desktop Foundation
2. Dock & Menu Bar
3. Window Manager
4. Education & Coffee
5. Technical Skills + Experience Registration
6. Experience Application
7. Projects Finder
8. Project Reports
9. JARVIS
10. Polish & Deployment

See [architecture](docs/ARCHITECTURE.md) and [phase dependencies and acceptance checks](docs/DEVELOPMENT_PLAN.md).

## Repository and deployment

Target: https://ishtiyak-ahmed.github.io (repository: `ishtiyak-ahmed/ishtiyak-ahmed.github.io`). Vite uses `base: '/'` because this is a user site at the domain root, not a repository subpath. The production artifact is `dist/`.

The local `rebuild/ishtiyak-os` branch starts from the existing `main` history. Old static files are replaced only in this working tree; the original versions remain in Git history. Phase 0 performs no push, merge, Pages workflow changes, or deployment. The published site remains unchanged. Phases 0–5 are checkpointed locally; Phase 6 changes remain uncommitted for review. Publishing belongs to Phase 10.

Routing is deferred until project reports need shareable URLs. The planned hash routing strategy avoids GitHub Pages deep-link 404s without a server or fallback script.

## Tooling notes

TypeScript 6.0 is selected because the current typescript-eslint release supports TypeScript below 6.1; the latest Vite starter's TypeScript 7 is not compatible with that ESLint parser yet.

At initialization, `npm audit` reported 10 moderate development-tooling findings in the ESLint/typescript-eslint dependency chain stemming from [minimatch GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). No production dependency findings were reported. Revisit when upstream tooling supports the patched dependency; no forced major downgrades or unsupported overrides were applied.

## Desktop content and layout

Edit `src/data/desktop.ts` to update the introduction, Currently copy, or photo. Quick Links derive from canonical contact configuration in `src/data/contact.ts`. Photo is a neutral square placeholder: import a real asset, set `photo.src`, supply descriptive `photo.alt`, and adjust `objectPosition` for the crop. No generated portrait is used.

Quick Links and Coffee share the verified email, LinkedIn, GitHub, and résumé destinations in `src/data/contact.ts`. The supplied `Ishtiyak_Ahmed copy.pdf` is copied byte-for-byte to `public/documents/Ishtiyak_Ahmed_Resume.pdf`. Both Resume actions open `/documents/Ishtiyak_Ahmed_Resume.pdf` in a new tab with `noopener noreferrer`; Vite includes that unchanged file in the production build. The original supplied file remains untouched.

`components/desktop/desktop.css` controls the composition. The photo and Currently widgets align at the upper left, with a 48px Quick Links strip directly below the photo. A large introduction is horizontally centered below the widget band, with reserved 40px menu and 120px dock regions (96px dock region on narrow screens). Narrow screens use flowing grid rows and may scroll vertically for legibility; there are no extra portfolio sections. No animation, state system, or new dependency was added in Phase 1.

The [Elena Gonci reference](https://elenagonci.com/) was inspected at 1440px desktop width for small widget proportions, central typography, negative space, and dock clearance. Only composition informed the layout; no source or graphic assets were copied.

## Dock and menu bar

The dock order and display names come from `src/data/apps.ts`: Home, Beyond the Data, Education, Experience, Projects, Technical Skills, and Let's Grab a Coffee. Each icon uses a consistent rounded-square treatment with Lucide artwork; registry icon configuration can be replaced with a custom image later.

Home minimizes all visible applications and focuses the desktop, preserving running instances. Each other dock icon opens, restores, or raises its one window. Running indicators reflect open instances, including minimized ones. Labels dismiss with Escape; reduced motion disables magnification. Touch targets remain at least 44px wide even at 320px.

The fixed menu shows **Ishtiyak OS | active application** (Home when no window is visible) and the visitor's local date/time. The clock updates once per minute and resyncs when the page becomes visible. Only the clock rerenders for time changes. No fake system indicators or nonfunctional menus are included. No dependencies were added in Phase 2.

## Window manager

The React reducer/context lives in `src/app/`, with `useWindowManager` exposing open, close, minimize, restore, focus, expand, and Show Desktop actions. Window metadata and size presets live in `src/data/apps.ts`; shared chrome lives in `src/components/windows/`.

Red closes and resets content on the next launch. Yellow hides the window without unmounting its content. Green toggles predefined normal/expanded sizes for Projects, Beyond the Data, Technical Skills, and Experience; it is disabled for Education and Let's Grab a Coffee. Expanded state survives minimizing and Home. Windows are centered within the usable area between the menu bar and dock, constrained to the viewport, and scroll internally as needed. There is no dragging, manual resizing, browser fullscreen, or focus trap.

Education, Let's Grab a Coffee, Technical Skills, and Experience render real content through `apps/ApplicationContent.tsx`. Projects and Beyond the Data retain neutral development placeholders. Session/window state resets on page reload.

`npm test` uses Node's built-in test runner and TypeScript stripping (no new dependency) to verify 30 lifecycle, selection, configuration, shared-data, asset, and clipboard scenarios. Browser checks covered all five requested sizes, expansion and compact controls, foreground/background interactions, keyboard focus, Home, running indicators, and preserved/reset scroll state on a deliberately short screen.

## Education and Coffee configuration

`src/data/education.ts` contains University of Toronto, Mississauga Campus, the Applied Statistics major, Computer Science and Geospatial Data Science minors, graduation, and logo fields. The confirmed `expectedGraduation` is **May 2029**; the fallback remains available for a future unknown value. `logo: null` uses a clearly labeled generic academic icon, not an institutional mark. Supply a verified official logo asset with descriptive alt text when available.

`src/data/contact.ts` is the single source of truth for email, LinkedIn, GitHub, résumé, and phone. It derives the four homepage Quick Links and Coffee's ordered links. Email uses `mailto:`; LinkedIn and GitHub open new tabs with `noopener noreferrer` and accessible new-tab labels. Coffee displays the confirmed public phone **437-606-3417**, with a copy action and `tel:+14376063417` Call link. Phone stays out of Quick Links. Resume is now enabled from the supplied, unchanged PDF at `/documents/Ishtiyak_Ahmed_Resume.pdf`; no résumé text was rewritten or reused as experience prose.

The phone copy button uses the browser Clipboard API with polite success/error feedback. Supported writes, rejection, unsupported access, and missing values are covered by tests. The browser success path displays “Phone number copied.” The two compact applications retain their existing presets and controls.

## Technical Skills and Experience

`src/data/skills.ts` defines the 18 supplied skills in four categories: Programming Languages; Data & Analytics; Frameworks & Development Tools; Engineering Practices. Every record has a stable ID, name, category, icon configuration, conservative description, and optional typed related-work references. No proficiency ratings or extra technologies are added.

Descriptions open on hover, keyboard focus, and tap/click. Click pins a description; Escape, a second click, or outside interaction dismisses it. Popovers stay within the content width and clear of the window controls; keyboard scrolling repositions the focused description. There is no search, filtering, or modal detail screen.

Nine local Devicon SVGs supply recognizable product/language identities. Neutral Lucide symbols cover the other tools and practices. Source revision, URLs, licensing, and fallback choices are documented in `src/assets/icons/skills/README.md`; no icon package was added.

Related work has no invented mappings. `resolveSkillWork` only exposes verified catalog entries for implemented destination applications. A future resource-selection callback is also required; supported references use the shared `openApp` API. Finder remains unsupported. Experience IDs must match the real experience configuration; no production skill mappings have been invented.

Experience uses the same registry/window lifecycle, slate briefcase icon, and 720×480 normal / 1000×700 expanded presets. Desktop content has a roughly 32% Work History list and an independently scrolling detail panel. Below 540px of actual application width, it switches to list-first navigation with Back to Work History; selection and panel scroll survive minimizing and expansion. Closing remounts the app at its first sorted entry and normal size.

`src/data/experience.ts` owns stable role IDs, employer, title, ISO year-month dates, location, and optional summary, accomplishments, skill IDs, project IDs, and HTTPS links. Only the verified E. Aferi role (Research and Project Support Intern, January–April 2026, Toronto, Ontario) is displayed. Summary, accomplishments, technologies, and project mappings are deliberately unset. A restrained detail-pending message fills the unfinished content area.

Future related navigation can call `openApp('experience', roleId)`. The optional window resource request selects a verified role in the existing instance, including after minimize. Invalid IDs are ignored; ordinary dock restore preserves the current selection. No new skill mappings or Finder navigation are added.

Fictional fixtures live exclusively under `tests/`. With Vite running, `/tests/browser/experience.html` exercises multiple roles; `?empty=1` checks empty data, and `?many=1` checks independent history scrolling. These test-only pages and data are not imported into the production entry or included in `dist/`. They are never shown in the live portfolio.

Outstanding assets/content: approved experience summary/accomplishments, official university logo, personal photograph, final skill descriptions, and verified skill-to-project/experience mappings. Run `npm run dev` for local review. Phase 7 has not started; nothing is pushed or deployed.
