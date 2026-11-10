# Ishtiyak OS

A macOS-inspired personal portfolio built incrementally. Phase 9 adds JARVIS, a deterministic portfolio terminal, and the first-release GitHub Actions pipeline. Experience shows one confirmed role; detailed project and experience wording remains pending review.

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
    finder/              Project explorer, navigation reducer, list/grid views
    jarvis/              Deterministic portfolio command interpreter
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
9. JARVIS + First Public Deployment
10. Comprehensive Visual Redesign & Motion Polish
11. Final Content, Accessibility, QA & Release Refinement

See [architecture](docs/ARCHITECTURE.md) and [phase dependencies and acceptance checks](docs/DEVELOPMENT_PLAN.md).

## Repository and deployment

Target: https://ishtiyak-ahmed.github.io (repository: `ishtiyak-ahmed/ishtiyak-ahmed.github.io`). Vite uses `base: '/'` because this is a user site at the domain root, not a repository subpath. The production artifact is `dist/`.

The local `rebuild/ishtiyak-os` branch starts from the existing `main` history. Old static files are replaced only in this working tree; the original versions remain in Git history. Phase 0 performs no push, merge, Pages workflow changes, or deployment. The published site remains unchanged. Phases 0–8 are checkpointed locally (Phase 8: `511e0c5`). Phase 9 is publicly deployed; its deployment status is recorded below.

Hash routing supports shareable Finder folders and report addresses without GitHub Pages rewrites, a server, or a routing dependency.

## Tooling notes

TypeScript 6.0 is selected because the current typescript-eslint release supports TypeScript below 6.1; the latest Vite starter's TypeScript 7 is not compatible with that ESLint parser yet.

At initialization, `npm audit` reported 10 moderate development-tooling findings in the ESLint/typescript-eslint dependency chain stemming from [minimatch GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). No production dependency findings were reported. Revisit when upstream tooling supports the patched dependency; no forced major downgrades or unsupported overrides were applied.

## Desktop content and layout

Edit `src/data/desktop.ts` to update the introduction, Currently copy, or photo. Quick Links derive from canonical contact configuration in `src/data/contact.ts`. Photo is a neutral square placeholder: import a real asset, set `photo.src`, supply descriptive `photo.alt`, and adjust `objectPosition` for the crop. No generated portrait is used.

Quick Links and Coffee share the verified email, LinkedIn, GitHub, and résumé destinations in `src/data/contact.ts`. The supplied `Ishtiyak_Ahmed copy.pdf` is copied byte-for-byte to `public/documents/Ishtiyak_Ahmed_Resume.pdf`. Both Resume actions open `/documents/Ishtiyak_Ahmed_Resume.pdf` in a new tab with `noopener noreferrer`; Vite includes that unchanged file in the production build. The original supplied file remains untouched.

`components/desktop/desktop.css` controls the composition. The photo sits upper-left, with a 48px Quick Links strip directly beneath it at the same width. Currently sits upper-right beneath the menu clock, outside the menu bar. A large introduction is horizontally centered below the widget band, with reserved 40px menu and 120px dock regions (96px dock region on narrow screens). Narrow screens use flowing grid rows and may scroll vertically for legibility; there are no extra portfolio sections. No animation, state system, or new dependency was added in Phase 1.

The [Elena Gonci reference](https://elenagonci.com/) was inspected at 1440px desktop width for small widget proportions, central typography, negative space, and dock clearance. Only composition informed the layout; no source or graphic assets were copied.

## Dock and menu bar

The dock order and display names come from `src/data/apps.ts`: Home, Beyond the Data, Education, Experience, Projects, Technical Skills, and Let's Grab a Coffee. Each icon uses a consistent rounded-square treatment with Lucide artwork; registry icon configuration can be replaced with a custom image later.

Home minimizes all visible applications and focuses the desktop, preserving running instances. Each other dock icon opens, restores, or raises its one window. Running indicators reflect open instances, including minimized ones. Labels dismiss with Escape; reduced motion disables magnification. Touch targets remain at least 44px wide even at 320px.

The fixed menu shows **Ishtiyak OS | active application** (Home when no window is visible) and the visitor's local date/time. The clock updates once per minute and resyncs when the page becomes visible. Only the clock rerenders for time changes. No fake system indicators or nonfunctional menus are included. No dependencies were added in Phase 2.

## Window manager

The React reducer/context lives in `src/app/`, with `useWindowManager` exposing open, close, minimize, restore, focus, expand, and Show Desktop actions. Window metadata and size presets live in `src/data/apps.ts`; shared chrome lives in `src/components/windows/`.

Red closes and resets content on the next launch. Yellow hides the window without unmounting its content. Green toggles predefined normal/expanded sizes for Projects, Beyond the Data, Technical Skills, and Experience; it is disabled for Education and Let's Grab a Coffee. Expanded state survives minimizing and Home. Windows are centered within the usable area between the menu bar and dock, constrained to the viewport, and scroll internally as needed. There is no dragging, manual resizing, browser fullscreen, or focus trap.

Education, Let's Grab a Coffee, Technical Skills, Experience, and Projects render real content through `apps/ApplicationContent.tsx`. Beyond the Data renders JARVIS. Every dock application now has functional content. Session/window state resets on page reload.

`npm test` uses Node's built-in test runner and TypeScript stripping (no new dependency) to verify 68 lifecycle, selection, configuration, shared-data, asset, and clipboard scenarios. Browser checks covered all five requested sizes, expansion and compact controls, foreground/background interactions, keyboard focus, Home, running indicators, and preserved/reset scroll state on a deliberately short screen.

## Education and Coffee configuration

`src/data/education.ts` contains University of Toronto, Mississauga Campus, the Applied Statistics major, Computer Science and Geospatial Data Science minors, graduation, and logo fields. The confirmed `expectedGraduation` is **May 2029**; the fallback remains available for a future unknown value. `logo: null` uses a clearly labeled generic academic icon, not an institutional mark. Supply a verified official logo asset with descriptive alt text when available.

`src/data/contact.ts` is the single source of truth for email, LinkedIn, GitHub, résumé, and phone. It derives the four homepage Quick Links and Coffee's ordered links. Email uses `mailto:`; LinkedIn and GitHub open new tabs with `noopener noreferrer` and accessible new-tab labels. Coffee displays the confirmed public phone **437-606-3417**, with a copy action and `tel:+14376063417` Call link. Phone stays out of Quick Links. Resume is now enabled from the supplied, unchanged PDF at `/documents/Ishtiyak_Ahmed_Resume.pdf`; no résumé text was rewritten or reused as experience prose.

The phone copy button uses the browser Clipboard API with polite success/error feedback. Supported writes, rejection, unsupported access, and missing values are covered by tests. The browser success path displays “Phone number copied.” The two compact applications retain their existing presets and controls.

## Technical Skills and Experience

`src/data/skills.ts` defines the 18 supplied skills in four categories: Programming Languages; Data & Analytics; Frameworks & Development Tools; Engineering Practices. Every record has a stable ID, name, category, icon configuration, conservative description, and optional typed related-work references. No proficiency ratings or extra technologies are added.

Descriptions open on hover, keyboard focus, and tap/click. Click pins a description; Escape, a second click, or outside interaction dismisses it. Popovers stay within the content width and clear of the window controls; keyboard scrolling repositions the focused description. There is no search, filtering, or modal detail screen.

Nine local Devicon SVGs supply recognizable product/language identities. Neutral Lucide symbols cover the other tools and practices. Source revision, URLs, licensing, and fallback choices are documented in `src/assets/icons/skills/README.md`; no icon package was added.

Related work has no invented mappings. `resolveSkillWork` only exposes verified catalog entries for implemented destination applications. A future resource-selection callback is also required; supported references use the shared `openApp` API. Finder references must match the real project registry. Experience IDs must match the real experience configuration; no production skill mappings have been invented.

Experience uses the same registry/window lifecycle, slate briefcase icon, and 720×480 normal / 1000×700 expanded presets. Desktop content has a roughly 32% Work History list and an independently scrolling detail panel. Below 540px of actual application width, it switches to list-first navigation with Back to Work History; selection and panel scroll survive minimizing and expansion. Closing remounts the app at its first sorted entry and normal size.

`src/data/experience.ts` owns stable role IDs, employer, title, ISO year-month dates, location, and optional summary, accomplishments, skill IDs, project IDs, and HTTPS links. Only the verified E. Aferi role (Research and Project Support Intern, January–April 2026, Toronto, Ontario) is displayed. Summary, accomplishments, technologies, and project mappings are deliberately unset. A restrained detail-pending message fills the unfinished content area.

Future related navigation can call `openApp('experience', roleId)`. The optional window resource request selects a verified role in the existing instance, including after minimize. Invalid IDs are ignored; ordinary dock restore preserves the current selection. Finder consumes the same request mechanism for project IDs and logical paths.

Fictional fixtures live exclusively under `tests/`. With Vite running, `/tests/browser/experience.html` exercises multiple roles; `?empty=1` checks empty data, and `?many=1` checks independent history scrolling. These test-only pages and data are not imported into the production entry or included in `dist/`. They are never shown in the live portfolio.

Outstanding assets/content: approved experience summary/accomplishments, official university logo, personal photograph, final skill descriptions, and verified skill-to-project/experience mappings. Run `npm run dev` for local review. Phase 9 implementation is verified; see the deployment status below.

## Projects Finder

`src/data/projects.ts` owns stable IDs/slugs, titles, optional descriptions/category/technologies, folder icon, status, and typed resources. Each resource has a stable ID, title, type, destination (`external`, `local`, or published `internal` report), href, and optional description. Only valid destinations render: external URLs require HTTPS without credentials; local files must be explicitly listed in `projectAssetPaths` and exist in public assets. No local project assets are registered yet.

The three confirmed folders are TTC Delay Patterns, JavaFX Paint Editor, and Tree-Based Data Visualizer. Only TTC has a configured external case study, https://ttc-delay-patterns.vercel.app (HTTP 200 verified). Other folders show concise pending-content information, without fictional files, repositories, metrics, or downloads. Safe external links announce a new tab and use `noopener noreferrer`.

Finder uses one AppWindow. Its local reducer stores root/project history, history index, selection, search, and list/grid mode. Logical paths start at `/ishtiyak/projects`; a project uses its slug beneath that root. Single click selects; double-click, Enter, or an explicit Open action opens. Back/Forward, root/sidebar, and breadcrumbs navigate inside the window. Search matches configured titles/descriptions case-insensitively across all projects; clearing it returns to the current folder. Both views share the same data and handlers. Minimize, focus, and expansion preserve state; closing resets everything on reopening.

`openApp('projects', projectIdOrPath)` opens/restores/focuses the existing instance at a valid project. Invalid requests leave Finder state intact. Skills related-work resolution validates real project IDs and still requires verified catalog relationships and a selection callback; no production relationships have been invented. Future JARVIS commands can reuse this registry.

Phase 8 maps shareable hash URLs such as `/#/projects/ttc-delay-patterns` to stable project IDs, keeping the desktop mounted and avoiding GitHub Pages server rewrites. Approved descriptions, final reports, repository/demo/documentation URLs, and verified skill relationships remain pending. Visual redesign is deliberately deferred to Phase 10.

Tests use isolated fixtures under `tests/fixtures/` and `/tests/browser/finder.html`; those fictional records are excluded from production. Phase 7 checks cover selection/opening, history, search, view switching, missing/invalid resources, cross-app requests, and lifecycle reset/preservation.

## Reports and shareable navigation (Phase 8)

`src/data/reportModel.ts` defines report publication as `unavailable`, `published-external` (verified HTTPS href), or `published-internal` (approved structured content). Each report belongs to its existing Project record, inheriting its stable ID/title. Content supports optional title/summary, technical metadata, and sections with stable IDs, headings, and text/list/code/image blocks. Empty sections, duplicate/invalid section IDs, and unavailable media are omitted. Images require descriptive alt text and an actual asset in `projectAssetPaths`; runtime image failures show a readable fallback.

`src/reports/ProjectReportPage.tsx` renders a separate article, not an OS window, with section navigation when useful, safe resource links, route focus, and a return-to-project link. TTC remains a published external report at its existing website. JavaFX Paint Editor and Tree-Based Data Visualizer explicitly remain unavailable; no internal production report is published. Visiting their report addresses displays a factual unavailable state, while unknown addresses show recovery to the desktop. TTC's report address offers its existing external destination without copying its content.

Supported routes: `/#/` (desktop), `/#/projects` (Finder root), `/#/projects/:slug` (Finder folder), and `/#/reports/:slug` (report or availability state). Direct loads and refresh restore the requested folder. Browser Back/Forward sends a new selection request to the same Finder instance; local Finder Back/Forward continues using its own folder history. Folder navigation writes browser history, while search, selection, view mode, and expansion do not. Home writes the desktop route; closing/minimizing Finder replaces the current folder route with desktop without adding a transient history entry. Ordinary dock restoration preserves Finder state and restores its folder URL. The desktop stays mounted but hidden on report/error pages.

Shared helpers in `data/projects.ts` include `projectHash`, `shareableProjectUrl`, `resolveProjectLocation`, `isReportPublished`, and `resolveReportDestination`. `projectResources` centralizes validation, excludes unpublished report links, and derives a report resource only for a valid published destination. Finder's Project link can be copied using normal browser link actions. External and internal report resources both open new tabs with `noopener noreferrer`. Source/demo/dashboard/documentation links require explicitly verified configuration; no repository links were added. Skills passes stable resource IDs through `openApp`; relationship catalogs remain empty until approved.

To publish an approved internal report later: add its reviewed content to the owning Project's `report` field with `published-internal`, give sections stable unique IDs, add actual public media to `projectAssetPaths`, and run data/rendering/production checks. A valid report resource and hash destination are then derived automatically. For an external report, set `published-external` with the verified destination instead. Keep unfinished work `unavailable`. The test-only `/tests/browser/reports.html` validates the template using fictional fixtures and a local diagram; production excludes both.

Outstanding: approved JavaFX/Tree report content, introductions, engineering details, outcomes, screenshots/diagrams, and independently verified repository/demo resources. TTC's full report is not duplicated. Final writing remains a separate review; Phase 9 has not started, and visual redesign remains Phase 10.

## JARVIS (Phase 9)

Beyond the Data (`jarvis`) hosts **Just Another Resume Verification & Info System**. `apps/jarvis/parser.ts` tokenizes whitespace and matching quotes; `commands.ts` owns typed command definitions, validation, registry-backed output, and declarative launch effects. JarvisApp alone performs those effects through shared `openApp` or safe new-tab navigation. Input is never evaluated as JavaScript or shell code. Runtime OS version comes from `data/system.ts`.

Commands: `help`, `status`, `whoami`, `about`, `ls`, `ls projects`, `ls experience`, `ls skills`, `open -a <ID-or-quoted-name>`, `open project <ID-or-slug>`, `open resume`, `open github`, `open linkedin`, `contact`, `cat resume`, `interests`, and `clear`. Aliases: `?` for help and `cls` for clear. Unknown commands, malformed quotes, unsupported options, and missing resources produce useful errors. Unconfigured interests are reported as unavailable. No portfolio claims are generated.

Enter submits; Up/Down browse session history and recover a draft. Tab completes supported commands, quoted application names, and project IDs, or lists ambiguous candidates; Shift+Tab leaves the field. Initialization is about one second, skippable, and immediate with reduced motion. Its messages correspond to local configuration reads. History is capped at 100 commands, transcript at 120 entries, and input at 2,000 characters. Output wraps; automatic scrolling follows only when the reader is already near the bottom. Minimize, expansion, and covering windows preserve state. Closing remounts a fresh session; clear retains history without rebooting.

## First release and future deployment

Public website: **https://ishtiyak-ahmed.github.io**. The existing repository is public and Pages uses GitHub Actions. Release `af90a9d` was integrated into main by a history-preserving fast-forward and [production deployment succeeded](https://github.com/ishtiyak-ahmed/ishtiyak-ahmed.github.io/actions/runs/42735245365). The live desktop, applications, JARVIS/Finder integration, project routes/refresh/history, static assets, and unchanged résumé were verified. Initial private-repository plan restrictions were resolved by the owner's explicit authorization to make this repository and its history public.

`.github/workflows/pages.yml` checks pushes to main/rebuild and pull requests into main using Node 24, npm ci, strict TypeScript, ESLint, all tests, build, and `npm run verify:build`. Only main can upload/deploy the production dist artifact. Official GitHub Actions handle Pages configuration, upload, and deployment, with scoped permissions, a github-pages environment, and serialized deployments. Generated dist files stay ignored. The build verifier checks asset paths, unchanged résumé bytes, and exclusion of test fixtures/development placeholders. Vite base remains `/`; hash routes require no server fallback.

Future Phase 10/11 releases: develop in a branch, run all checks, review the UI/functionality, integrate the approved branch into main through an ordinary merge/fast-forward or PR, let Actions deploy, and verify the actual public URL (apps, résumé, resources, hash refresh/history, assets, and console). Do not manually copy files into the old site. See [GitHub's custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Known limits: command history is session-only; Tab completion is intentionally simple; popups may require the provided fallback link. No AI, backend, arbitrary commands, or new dependencies are introduced. Personal photograph, official university artwork, approved project reports and role details, and verified related-work mappings remain pending. Phase 10 owns comprehensive visual/motion redesign; Phase 11 owns final content, accessibility, QA, and release refinement.
