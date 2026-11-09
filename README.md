# Ishtiyak OS

A macOS-inspired personal portfolio built incrementally. Phase 5 adds the categorized Technical Skills toolkit, a seventh Experience dock application, and confirmed Education/Coffee details. Experience remains a development placeholder; its full content is planned for Phase 6.

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

The local `rebuild/ishtiyak-os` branch starts from the existing `main` history. Old static files are replaced only in this working tree; the original versions remain in Git history. Phase 0 performs no push, merge, Pages workflow changes, or deployment. The published site remains unchanged. Phases 0–4 are checkpointed locally; Phase 5 changes remain uncommitted for review. Publishing belongs to Phase 10.

Routing is deferred until project reports need shareable URLs. The planned hash routing strategy avoids GitHub Pages deep-link 404s without a server or fallback script.

## Tooling notes

TypeScript 6.0 is selected because the current typescript-eslint release supports TypeScript below 6.1; the latest Vite starter's TypeScript 7 is not compatible with that ESLint parser yet.

At initialization, `npm audit` reported 10 moderate development-tooling findings in the ESLint/typescript-eslint dependency chain stemming from [minimatch GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). No production dependency findings were reported. Revisit when upstream tooling supports the patched dependency; no forced major downgrades or unsupported overrides were applied.

## Desktop content and layout

Edit `src/data/desktop.ts` to update the introduction, Currently copy, or photo. Quick Links derive from canonical contact configuration in `src/data/contact.ts`. Photo is a neutral square placeholder: import a real asset, set `photo.src`, supply descriptive `photo.alt`, and adjust `objectPosition` for the crop. No generated portrait is used.

Quick Links use the LinkedIn, GitHub, and email destinations from the previous portfolio. Resume is deliberately disabled (`href: null`) until a current file is supplied. Place the current file at `public/documents/Ishtiyak_Ahmed_Resume.pdf` and set `contactDetails.resume` to `/documents/Ishtiyak_Ahmed_Resume.pdf` when ready; both Quick Links and Coffee will use it. Links provide hover and keyboard-focus labels; unavailable actions have no destination or click behavior.

`components/desktop/desktop.css` controls the composition. The photo and Currently widgets align at the upper left, with a 48px Quick Links strip directly below the photo. A large introduction is horizontally centered below the widget band, with reserved 40px menu and 120px dock regions (96px dock region on narrow screens). Narrow screens use flowing grid rows and may scroll vertically for legibility; there are no extra portfolio sections. No animation, state system, or new dependency was added in Phase 1.

The [Elena Gonci reference](https://elenagonci.com/) was inspected at 1440px desktop width for small widget proportions, central typography, negative space, and dock clearance. Only composition informed the layout; no source or graphic assets were copied.

## Dock and menu bar

The dock order and display names come from `src/data/apps.ts`: Home, Beyond the Data, Education, Experience, Projects, Technical Skills, and Let's Grab a Coffee. Each icon uses a consistent rounded-square treatment with Lucide artwork; registry icon configuration can be replaced with a custom image later.

Home minimizes all visible applications and focuses the desktop, preserving running instances. Each other dock icon opens, restores, or raises its one window. Running indicators reflect open instances, including minimized ones. Labels dismiss with Escape; reduced motion disables magnification. Touch targets remain at least 44px wide even at 320px.

The fixed menu shows **Ishtiyak OS | active application** (Home when no window is visible) and the visitor's local date/time. The clock updates once per minute and resyncs when the page becomes visible. Only the clock rerenders for time changes. No fake system indicators or nonfunctional menus are included. No dependencies were added in Phase 2.

## Window manager

The React reducer/context lives in `src/app/`, with `useWindowManager` exposing open, close, minimize, restore, focus, expand, and Show Desktop actions. Window metadata and size presets live in `src/data/apps.ts`; shared chrome lives in `src/components/windows/`.

Red closes and resets content on the next launch. Yellow hides the window without unmounting its content. Green toggles predefined normal/expanded sizes for Projects, Beyond the Data, Technical Skills, and Experience; it is disabled for Education and Let's Grab a Coffee. Expanded state survives minimizing and Home. Windows are centered within the usable area between the menu bar and dock, constrained to the viewport, and scroll internally as needed. There is no dragging, manual resizing, browser fullscreen, or focus trap.

Education, Let's Grab a Coffee, and Technical Skills render real content through `apps/ApplicationContent.tsx`. Experience, Projects, and Beyond the Data retain neutral development placeholders. Session/window state resets on page reload.

`npm test` uses Node's built-in test runner and TypeScript stripping (no new dependency) to verify 21 lifecycle, configuration, shared-data, asset, and clipboard scenarios. Browser checks covered all five requested sizes, expansion and compact controls, foreground/background interactions, keyboard focus, Home, running indicators, and preserved/reset scroll state on a deliberately short screen.

## Education and Coffee configuration

`src/data/education.ts` contains University of Toronto, Mississauga Campus, the Applied Statistics major, Computer Science and Geospatial Data Science minors, graduation, and logo fields. The confirmed `expectedGraduation` is **May 2029**; the fallback remains available for a future unknown value. `logo: null` uses a clearly labeled generic academic icon, not an institutional mark. Supply a verified official logo asset with descriptive alt text when available.

`src/data/contact.ts` is the single source of truth for email, LinkedIn, GitHub, résumé, and phone. It derives the four homepage Quick Links and Coffee's ordered links. Email uses `mailto:`; LinkedIn and GitHub open new tabs with `noopener noreferrer` and accessible new-tab labels. Coffee displays the confirmed public phone **437-606-3417**, with a copy action and `tel:+14376063417` Call link. Phone stays out of Quick Links. Resume remains disabled because the supplied filename `Ishtiyak_Ahmed(1).pdf` was not found in this workspace or the accessible Codex attachment directory. Place the unmodified current PDF at `public/documents/Ishtiyak_Ahmed_Resume.pdf`, then set the single `contactDetails.resume` field to `/documents/Ishtiyak_Ahmed_Resume.pdf`. Both Resume actions will open it in a new tab; Vite copies public documents into the production build.

The phone copy button uses the browser Clipboard API with polite success/error feedback. Supported writes, rejection, unsupported access, and missing values are covered by tests. The browser success path displays “Phone number copied.” The two compact applications retain their existing presets and controls.

## Technical Skills and Experience

`src/data/skills.ts` defines the 18 supplied skills in four categories: Programming Languages; Data & Analytics; Frameworks & Development Tools; Engineering Practices. Every record has a stable ID, name, category, icon configuration, conservative description, and optional typed related-work references. No proficiency ratings or extra technologies are added.

Descriptions open on hover, keyboard focus, and tap/click. Click pins a description; Escape, a second click, or outside interaction dismisses it. Popovers stay within the content width and clear of the window controls; keyboard scrolling repositions the focused description. There is no search, filtering, or modal detail screen.

Nine local Devicon SVGs supply recognizable product/language identities. Neutral Lucide symbols cover the other tools and practices. Source revision, URLs, licensing, and fallback choices are documented in `src/assets/icons/skills/README.md`; no icon package was added.

Related work has no invented mappings. `resolveSkillWork` only exposes verified catalog entries for implemented destination applications. A future resource-selection callback is also required; supported references use the shared `openApp` API. Placeholder Finder/Experience destinations currently produce no links.

Experience uses the same registry/window lifecycle, a slate briefcase icon, 720×480 normal and 1000×700 expanded presets, and only the Phase 6 development message. The seven-icon dock keeps 44px targets at 320px with tighter spacing. There is no Experience split view or work-history content yet.

Outstanding assets/content: official university logo, current résumé PDF, personal photograph, final skill descriptions, and verified skill-to-project/experience mappings. Run `npm run dev` for local review. No pushes or deployments occur during this phase.
