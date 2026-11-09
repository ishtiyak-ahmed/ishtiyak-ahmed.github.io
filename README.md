# Ishtiyak OS

A macOS-inspired personal portfolio built incrementally. Phase 0 supplies the development environment, design tokens, and a minimal React screen. Portfolio applications and desktop behavior are planned, not implemented.

## Stack

React, TypeScript (strict), Vite, and Tailwind CSS through its Vite plugin. Lucide React and Motion are installed at the user's request for future icons and animation; neither is imported into the placeholder. ESLint checks TypeScript and React conventions. No backend or external font service is required.

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
  app/App.tsx            Minimal Phase 0 screen; future OS composition
  components/
    desktop/widgets/     Reserved for desktop and widgets
    windows/             Reserved for shared window chrome
    ui/                  Reserved for small shared controls
  apps/
    finder/              Future project explorer
    jarvis/              Future deterministic portfolio terminal
    education/           Future education application
    skills/              Future categorized skills application
    coffee/              Future coffee-themed contact application
  data/                  Future typed portfolio content
  hooks/                 Future shared behavior
  styles/global.css      Tailwind import, tokens, global base styles
  assets/{icons,images}/  Future bundled assets
docs/
  ARCHITECTURE.md
  DEVELOPMENT_PLAN.md
```

Reserved directories contain only `.gitkeep`; they have no implementation yet. Root configuration includes `vite.config.ts`, the `tsconfig*.json` project references, and `eslint.config.js`. `package-lock.json` fixes the dependency resolution for `npm ci`.

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

The local `rebuild/ishtiyak-os` branch starts from the existing `main` history. Old static files are replaced only in this working tree; the original versions remain in Git history. Phase 0 performs no push, merge, Pages workflow changes, or deployment. The published site remains unchanged. Review and commit the local changes when desired; publishing belongs to Phase 9.

Routing is deferred until project reports need shareable URLs. The planned hash routing strategy avoids GitHub Pages deep-link 404s without a server or fallback script.

## Tooling notes

TypeScript 6.0 is selected because the current typescript-eslint release supports TypeScript below 6.1; the latest Vite starter's TypeScript 7 is not compatible with that ESLint parser yet.

At initialization, `npm audit` reported 10 moderate development-tooling findings in the ESLint/typescript-eslint dependency chain stemming from [minimatch GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). No production dependency findings were reported. Revisit when upstream tooling supports the patched dependency; no forced major downgrades or unsupported overrides were applied.
