export type ProjectResourceType = 'report' | 'source' | 'demo' | 'dashboard' | 'documentation' | 'case-study'
export interface ProjectResource {
  id: string
  title: string
  type: ProjectResourceType
  destination: 'external' | 'local'
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
  status: 'details-pending' | 'available'
}

export const projects: readonly Project[] = [
  { id: 'ttc-delay-patterns', slug: 'ttc-delay-patterns', title: 'TTC Delay Patterns', folderIcon: 'folder', status: 'available', resources: [
    { id: 'ttc-case-study', title: 'TTC Delay Patterns case study', type: 'case-study', destination: 'external', href: 'https://ttc-delay-patterns.vercel.app' },
  ] },
  { id: 'javafx-paint-editor', slug: 'javafx-paint-editor', title: 'JavaFX Paint Editor', folderIcon: 'folder', status: 'details-pending', resources: [] },
  { id: 'tree-based-data-visualizer', slug: 'tree-based-data-visualizer', title: 'Tree-Based Data Visualizer', folderIcon: 'folder', status: 'details-pending', resources: [] },
]

export const PROJECTS_ROOT = '/ishtiyak/projects'
// Register only actual public project assets here; checked against disk in tests.
export const projectAssetPaths: readonly string[] = []

export function validProjectResource(resource: ProjectResource, localAssets: readonly string[] = projectAssetPaths): boolean {
  if (!resource.id.trim() || !resource.title.trim() || !['report', 'source', 'demo', 'dashboard', 'documentation', 'case-study'].includes(resource.type)) return false
  if (resource.destination !== 'external' && resource.destination !== 'local') return false
  if (resource.destination === 'local') return resource.href.startsWith('/') && !resource.href.startsWith('//') && localAssets.includes(resource.href)
  try {
    const url = new URL(resource.href)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch { return false }
}

export function projectResources(project: Project): ProjectResource[] {
  return project.resources.filter((resource) => validProjectResource(resource))
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
