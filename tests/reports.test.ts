import assert from 'node:assert/strict'
import { test } from 'node:test'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { projects, isReportPublished, resolveReportDestination, projectHash, reportHash, shareableProjectUrl, projectResources, validProjectResource } from '../src/data/projects.ts'
import { reportBlocks, reportSections, validReport } from '../src/data/reportModel.ts'
import { parsePortfolioRoute } from '../src/routing/projectRoutes.ts'
import { finderLocation, finderReducer, initialFinderState } from '../src/apps/finder/finderState.ts'
import { windowReducer, initialWindowState } from '../src/app/windowState.ts'
import { reportFixture, reportAssets } from './fixtures/reports.ts'

test('Production report states preserve TTC external publication and leave the other reports unavailable', () => {
  assert.deepEqual(projects.map((p) => p.report?.status), ['published-external', 'unavailable', 'unavailable'])
  assert.equal(resolveReportDestination(projects[0])?.href, 'https://ttc-delay-patterns.vercel.app')
  assert.ok(isReportPublished(projects[0]))
  assert.equal(resolveReportDestination(projects[1]), undefined)
  assert.equal(isReportPublished(projects[2]), false)
  assert.ok(!projects.some((p) => p.report?.status === 'published-internal'))
})
test('A populated internal report is publishable and produces one real internal report resource', () => {
  assert.ok(isReportPublished(reportFixture, reportAssets))
  assert.deepEqual(resolveReportDestination(reportFixture), { destination: 'internal', href: '#/reports/test-report' })
  const report = projectResources(reportFixture).find((r) => r.type === 'report')!
  assert.ok(validProjectResource(report, reportAssets, [reportFixture]))
  assert.equal(report.href, reportHash(reportFixture))
  assert.equal(validProjectResource({ ...report, href: '#/reports/missing' }, reportAssets, [reportFixture]), false)
})
test('Empty or invalid reports cannot publish functional report links', () => {
  assert.equal(validReport({ status: 'published-internal', content: { sections: [] } }, []), false)
  assert.equal(validReport({ status: 'published-external', href: 'javascript:alert(1)' }, []), false)
  const empty = { ...reportFixture, report: { status: 'published-internal' as const, content: { sections: [] } } }
  assert.equal(resolveReportDestination(empty), undefined)
  assert.equal(projectResources(empty).some((r) => r.type === 'report'), false)
  assert.equal(projectResources({ ...empty, resources: [{ ...projects[0].resources[0], type: 'report' }] }).length, 0)
})
test('Optional empty sections, missing media, invalid IDs and duplicate section IDs are omitted', () => {
  if (reportFixture.report?.status !== 'published-internal') throw new Error('fixture')
  const sections = reportSections(reportFixture.report.content, reportAssets)
  assert.deepEqual(sections.map((s) => s.id), ['approach', 'evidence'])
  assert.equal(reportSections({ sections: [...sections, sections[0], { ...sections[0], id: 'bad id' }] }, reportAssets).length, 2)
  for (const asset of reportAssets) assert.ok(existsSync(new URL(`..${asset}`, import.meta.url)))
  assert.equal(reportBlocks([{ type: 'image', src: '/absent.svg', alt: 'Absent' }, { type: 'image', src: reportAssets[0], alt: '' }, { type: 'text', text: ' ' }, { type: 'code', code: '' }], reportAssets).length, 0)
})
test('Report text, lists, code, and approved media retain their actual content', () => {
  const blocks = reportBlocks([{ type: 'list', items: ['', 'Actual item'] }, { type: 'code', code: '<script>literal excerpt</script>' }, { type: 'image', src: reportAssets[0], alt: 'Actual alt' }], reportAssets)
  assert.deepEqual(blocks[0], { type: 'list', items: ['Actual item'] })
  assert.equal(blocks.length, 3)
})
test('External resources reject unsafe schemes, credentials, and absent destinations', () => {
  const resource = projects[0].resources[0]
  for (const href of ['', 'http://example.invalid', 'javascript:alert(1)', 'https://u:p@example.invalid']) assert.equal(validProjectResource({ ...resource, href }), false)
  assert.equal(projectResources(projects[0]).length, 1)
})
test('Project and report URL helpers use canonical stable slugs and reject unknown IDs', () => {
  assert.equal(projectHash(null), '#/projects')
  assert.equal(projectHash(projects[1].id), '#/projects/javafx-paint-editor')
  assert.equal(projectHash('missing'), undefined)
  assert.equal(shareableProjectUrl(projects[0].id, 'https://ishtiyak-ahmed.github.io/#/'), 'https://ishtiyak-ahmed.github.io/#/projects/ttc-delay-patterns')
  assert.equal(shareableProjectUrl('missing', 'https://ishtiyak-ahmed.github.io/'), undefined)
})
test('Routes parse desktop, root, project and report paths without accepting partial or malformed slugs', () => {
  assert.deepEqual(parsePortfolioRoute(''), { kind: 'desktop' })
  assert.deepEqual(parsePortfolioRoute('#/projects'), { kind: 'projects', projectId: null })
  for (const project of projects) {
    assert.deepEqual(parsePortfolioRoute(projectHash(project.id)!), { kind: 'projects', projectId: project.id })
    assert.deepEqual(parsePortfolioRoute(reportHash(project)), { kind: 'report', projectId: project.id })
  }
  for (const hash of ['#/projects/missing', '#/reports/missing', '#/projects/%E0', '#/projects/ttc-delay-patterns/extra', '#/elsewhere']) assert.deepEqual(parsePortfolioRoute(hash), { kind: 'unknown' })
})
test('Direct loading, refreshed routes, and repeated requests synchronize a single Finder instance', () => {
  const hash = projectHash(projects[1].id)!
  let windows = initialWindowState
  let finder = initialFinderState()
  for (const routeHash of [hash, projectHash(projects[0].id)!, hash, projectHash(projects[0].id)!]) {
    const route = parsePortfolioRoute(routeHash)
    if (route.kind !== 'projects' || !route.projectId) throw new Error('route')
    windows = windowReducer(windows, { type: 'open', appId: 'projects', resourceId: route.projectId })
    finder = finderReducer(finder, { type: 'request', target: route.projectId }, projects)
    assert.equal(windows.windows.length, 1)
    assert.equal(finderLocation(finder), route.projectId)
    assert.equal(finder.selection, null)
  }
  const refreshed = parsePortfolioRoute(hash)
  assert.deepEqual(refreshed, { kind: 'projects', projectId: projects[1].id })
  assert.equal(windows.windows[0].instanceId, 1)
})
test('Production source imports exclude development fixtures and browser harnesses', () => {
  function visit(dir: URL) { for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir)
    if (entry.isDirectory()) visit(path)
    else if (/\.[tj]sx?$/.test(entry.name)) assert.doesNotMatch(readFileSync(path, 'utf8'), /from\s+['"][^'"]*(?:tests\/|fixtures\/)/)
  } }
  visit(new URL('../src/', import.meta.url))
})
