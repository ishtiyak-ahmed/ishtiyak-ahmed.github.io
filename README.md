# Ishtiyak OS

A macOS-inspired personal portfolio built incrementally. Phase 1 adds a viewport-based desktop homepage with a centered introduction and compact personal widgets. The menu bar, dock, window manager, and portfolio applications are planned, not implemented.

## Stack

React, TypeScript (strict), Vite, and Tailwind CSS through its Vite plugin. Lucide React supplies general widget icons; Motion is installed for later animations and remains unused. ESLint checks TypeScript and React conventions. No backend or external font service is required.

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
npm run build      # TypeScript checks, then production output in dist/
npm run preview    # Serve the production build locally
```

## Structure

```text
public/                  Static files copied without transformation
src/
  main.tsx               React entry point
  app/App.tsx            Desktop composition; future OS controller
  components/
    desktop/widgets/     Desktop shell, hero, photo, Currently, Quick Links
    windows/             Reserved for shared window chrome
    ui/                  Small local brand icon SVGs
  apps/
    finder/              Future project explorer
    jarvis/              Future deterministic portfolio terminal
    education/           Future education application
    skills/              Future categorized skills application
    coffee/              Future coffee-themed contact application
  data/                  Typed desktop content and destinations
  hooks/                 Future shared behavior
  styles/global.css      Tailwind import, tokens, global base styles
  assets/{icons,images}/  Future bundled assets
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
5. Technical Skills
6. Projects Finder
7. Project Reports
8. JARVIS
9. Polish & Deployment

See [architecture](docs/ARCHITECTURE.md) and [phase dependencies and acceptance checks](docs/DEVELOPMENT_PLAN.md).

## Repository and deployment

Target: https://ishtiyak-ahmed.github.io (repository: `ishtiyak-ahmed/ishtiyak-ahmed.github.io`). Vite uses `base: '/'` because this is a user site at the domain root, not a repository subpath. The production artifact is `dist/`.

The local `rebuild/ishtiyak-os` branch starts from the existing `main` history. Old static files are replaced only in this working tree; the original versions remain in Git history. Phase 0 performs no push, merge, Pages workflow changes, or deployment. The published site remains unchanged. Phase 0 is checkpointed locally; Phase 1 changes remain uncommitted for visual review. Publishing belongs to Phase 9.

Routing is deferred until project reports need shareable URLs. The planned hash routing strategy avoids GitHub Pages deep-link 404s without a server or fallback script.

## Tooling notes

TypeScript 6.0 is selected because the current typescript-eslint release supports TypeScript below 6.1; the latest Vite starter's TypeScript 7 is not compatible with that ESLint parser yet.

At initialization, `npm audit` reported 10 moderate development-tooling findings in the ESLint/typescript-eslint dependency chain stemming from [minimatch GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). No production dependency findings were reported. Revisit when upstream tooling supports the patched dependency; no forced major downgrades or unsupported overrides were applied.

## Desktop content and layout

Edit `src/data/desktop.ts` to update the introduction, Currently copy, photo, or Quick Links. Photo is a neutral square placeholder: import a real asset, set `photo.src`, supply descriptive `photo.alt`, and adjust `objectPosition` for the crop. No generated portrait is used.

Quick Links use the LinkedIn, GitHub, and email destinations from the previous portfolio. Resume is deliberately disabled (`href: null`) until a current file is supplied. Place the file in `public/` and set its root-relative URL when ready. Links provide hover and keyboard-focus labels; unavailable actions have no destination or click behavior.

`components/desktop/desktop.css` controls the composition. The photo and Currently widgets align at the upper left, with a 48px Quick Links strip directly below the photo. A large introduction is horizontally centered below the widget band, with reserved 40px menu and 120px dock regions. Narrow screens use flowing grid rows and may scroll vertically for legibility; there are no extra portfolio sections. No animation, state system, or new dependency was added in Phase 1.

The [Elena Gonci reference](https://elenagonci.com/) was inspected at 1440px desktop width for small widget proportions, central typography, negative space, and dock clearance. Only composition informed the layout; no source or graphic assets were copied.
