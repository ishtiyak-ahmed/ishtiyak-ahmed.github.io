import type { Project } from '../../src/data/projects.ts'
export const reportAssets = ['/tests/browser/report-evidence.svg']
export const reportFixture: Project = {
  id: 'test-report', slug: 'test-report', title: 'TEST FIXTURE report project', folderIcon: 'folder', status: 'available',
  resources: [{ id: 'fixture-docs', title: 'TEST FIXTURE verified-format link', type: 'documentation', destination: 'external', href: 'https://example.invalid/documentation' }],
  report: { status: 'published-internal', content: {
    summary: 'TEST FIXTURE introduction. Not production portfolio content.',
    technicalMetadata: [{ label: 'TEST FIXTURE language', value: 'TypeScript' }, { label: '', value: '' }],
    sections: [
      { id: 'approach', heading: 'TEST FIXTURE approach', blocks: [{ type: 'text', text: 'TEST FIXTURE approved-text simulation.' }, { type: 'list', items: ['TEST FIXTURE first step', '', 'TEST FIXTURE second step'] }, { type: 'code', language: 'TypeScript', code: 'const fixture = true' }] },
      { id: 'evidence', heading: 'TEST FIXTURE evidence', blocks: [{ type: 'image', src: reportAssets[0], alt: 'TEST FIXTURE two connected boxes', caption: 'TEST FIXTURE diagram.' }] },
      { id: 'empty', heading: 'DO NOT RENDER empty section', blocks: [] },
      { id: 'missing', heading: 'DO NOT RENDER missing media', blocks: [{ type: 'image', src: '/missing.svg', alt: 'Missing test image' }] },
    ],
  } },
}
