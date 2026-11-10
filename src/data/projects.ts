import { safeExternalUrl, validReport } from './reportModel.ts'
import type { ProjectReport } from './reportModel.ts'
export type ProjectResourceType = 'report' | 'source' | 'demo' | 'dashboard' | 'documentation' | 'case-study'
export interface ProjectResource {
  id: string
  title: string
  type: ProjectResourceType
  destination: 'external' | 'local' | 'internal'
  href: string
  description?: string
}
export interface Project {
  id: string
  slug: string
  title: string
  shortDescription?: string
  category?: string
  technologies?: readonly string[]
  folderIcon: 'folder'
  resources: readonly ProjectResource[]
  report?: ProjectReport
  status: 'details-pending' | 'available'
}

export const projects: readonly Project[] = [
  { id: 'ttc-delay-patterns', slug: 'ttc-delay-patterns', title: 'TTC Delay Patterns', folderIcon: 'folder', status: 'available', report: { status: 'published-external', href: 'https://ttc-delay-patterns.vercel.app' }, resources: [
    { id: 'ttc-case-study', title: 'TTC Delay Patterns case study', type: 'case-study', destination: 'external', href: 'https://ttc-delay-patterns.vercel.app' },
  ] },
  { id: 'javafx-paint-editor', slug: 'javafx-paint-editor', title: 'JavaFX Paint Editor', folderIcon: 'folder', status: 'details-pending', report: { status: 'unavailable' }, resources: [] },
  { id: 'tree-based-data-visualizer', slug: 'tree-based-data-visualizer', title: 'Tree-Based Data Visualizer', folderIcon: 'folder', status: 'details-pending', report: { status: 'unavailable' }, resources: [] },
]

export const PROJECTS_ROOT = '/ishtiyak/projects'
// Register only actual public project assets here; checked against disk in tests.
export const projectAssetPaths: readonly string[] = []

export function validProjectResource(resource: ProjectResource, localAssets: readonly string[] = projectAssetPaths, entries: readonly Project[] = projects): boolean {
  if (!resource.id.trim() || !resource.title.trim() || !['report', 'source', 'demo', 'dashboard', 'documentation', 'case-study'].includes(resource.type)) return false
  if (resource.destination === 'internal') return entries.some((project) => project.report?.status === 'published-internal' && validReport(project.report, localAssets) && resource.href === reportHash(project))
  if (resource.destination !== 'external' && resource.destination !== 'local') return false
  if (resource.destination === 'local') return resource.href.startsWith('/') && !resource.href.startsWith('//') && localAssets.includes(resource.href)
  return safeExternalUrl(resource.href)
}

export function projectResources(project: Project): ProjectResource[] {
  const report = resolveReportDestination(project)
  const resources = project.resources.filter((resource) => validProjectResource(resource, projectAssetPaths, [project]) && (!['report', 'case-study'].includes(resource.type) || (report?.href === resource.href && report.destination === resource.destination)))
  if (report && !resources.some((resource) => resource.href === report.href)) resources.unshift({ id: `${project.id}-report`, title: 'Project Report', type: 'report', ...report })
  return resources
}

export function resolveProjectLocation(target: string, entries: readonly Project[] = projects): string | null | undefined {
  const normalized = target.replace(/\/$/, '')
  if (normalized === PROJECTS_ROOT) return null
  const project = entries.find((item) => item.id === normalized || item.slug === normalized || `${PROJECTS_ROOT}/${item.slug}` === normalized)
  return project?.id
}

export function projectPath(id: string | null, entries: readonly Project[] = projects): string {
  const project = entries.find((item) => item.id === id)
  return project ? `${PROJECTS_ROOT}/${project.slug}` : PROJECTS_ROOT
}

export function searchProjects(query: string, entries: readonly Project[] = projects): Project[] {
  const normalized = query.trim().toLowerCase()
  return entries.filter((item) => `${item.title} ${item.shortDescription ?? ''}`.toLowerCase().includes(normalized))
}

export function projectHash(id: string | null, entries: readonly Project[] = projects): string | undefined {
  if (id === null) return '#/projects'
  const project = entries.find((entry) => entry.id === id)
  return project ? `#/projects/${encodeURIComponent(project.slug)}` : undefined
}
export function reportHash(project: Project): string { return `#/reports/${encodeURIComponent(project.slug)}` }
export function shareableProjectUrl(id: string | null, siteUrl: string, entries: readonly Project[] = projects): string | undefined {
  const hash = projectHash(id, entries)
  if (!hash) return undefined
  const url = new URL(siteUrl)
  url.hash = hash
  return url.href
}
export function isReportPublished(project: Project, assets: readonly string[] = projectAssetPaths): boolean { return validReport(project.report, assets) }
export function resolveReportDestination(project: Project): { href: string; destination: 'internal' | 'external' } | undefined {
  if (!isReportPublished(project)) return undefined
  if (project.report?.status === 'published-external') return { href: project.report.href, destination: 'external' }
  return { href: reportHash(project), destination: 'internal' }
}
