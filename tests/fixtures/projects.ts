import type { Project } from '../../src/data/projects.ts'

// Fictional TEST FIXTURES, never imported into production source.
export const projectFixtures: readonly Project[] = [
  { id: 'test-alpha', slug: 'test-alpha-folder', title: 'TEST FIXTURE Alpha', shortDescription: 'Test fixture for geospatial search.', folderIcon: 'folder', status: 'available', resources: [
    { id: 'test-resource', title: 'TEST FIXTURE resource', type: 'documentation', destination: 'external', href: 'https://example.invalid/test' },
    { id: 'test-invalid', title: 'TEST FIXTURE invalid resource', type: 'demo', destination: 'external', href: 'javascript:alert(1)' },
  ] },
  { id: 'test-beta', slug: 'test-beta-folder', title: 'TEST FIXTURE Beta', folderIcon: 'folder', status: 'details-pending', resources: [] },
  { id: 'test-gamma', slug: 'test-gamma-folder', title: 'TEST FIXTURE Gamma', shortDescription: 'Test fixture for data search.', folderIcon: 'folder', status: 'details-pending', resources: [] },
]
