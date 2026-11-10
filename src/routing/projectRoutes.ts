import { projects } from '../data/projects.ts'
import type { Project } from '../data/projects.ts'

export type PortfolioRoute = { kind: 'desktop' } | { kind: 'projects'; projectId: string | null } | { kind: 'report'; projectId: string } | { kind: 'unknown' }
export function parsePortfolioRoute(hash: string, entries: readonly Project[] = projects): PortfolioRoute {
  if (hash === '' || hash === '#' || hash === '#/') return { kind: 'desktop' }
  if (hash === '#/projects' || hash === '#/projects/') return { kind: 'projects', projectId: null }
  const match = /^#\/(projects|reports)\/([^/]+)\/?$/.exec(hash)
  if (!match) return { kind: 'unknown' }
  let slug: string
  try { slug = decodeURIComponent(match[2]) } catch { return { kind: 'unknown' } }
  const project = entries.find((entry) => entry.slug === slug)
  if (!project) return { kind: 'unknown' }
  return match[1] === 'projects' ? { kind: 'projects', projectId: project.id } : { kind: 'report', projectId: project.id }
}
