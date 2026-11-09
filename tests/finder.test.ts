import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'
import { PROJECTS_ROOT, projectAssetPaths, projectPath, projectResources, projects, resolveProjectLocation, searchProjects, validProjectResource } from '../src/data/projects.ts'
import { finderItems, finderLocation, finderReducer, initialFinderState } from '../src/apps/finder/finderState.ts'
import type { FinderAction } from '../src/apps/finder/finderState.ts'
import { initialWindowState, windowReducer } from '../src/app/windowState.ts'
import { resolveSkillWork } from '../src/apps/skills/relatedWork.ts'
import { skills } from '../src/data/skills.ts'
import { projectFixtures } from './fixtures/projects.ts'

const run = (...actions: FinderAction[]) => actions.reduce((state, action) => finderReducer(state, action, projectFixtures), initialFinderState())

test('Production projects contain only the three confirmed folders and supplied TTC resource', () => {
  assert.deepEqual(projects.map((project) => project.title), ['TTC Delay Patterns', 'JavaFX Paint Editor', 'Tree-Based Data Visualizer'])
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length)
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length)
  assert.equal(projects.flatMap((project) => project.resources).length, 1)
  assert.equal(projects[0].resources[0].href, 'https://ttc-delay-patterns.vercel.app')
  assert.ok(projects.every((project) => project.resources.every((resource) => validProjectResource(resource))))
  for (const path of projectAssetPaths) assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)))
})

test('Finder starts at the root in list view with no selection and real folder items', () => {
  const state = initialFinderState()
  assert.equal(finderLocation(state), null)
  assert.equal(state.view, 'list')
  assert.equal(state.selection, null)
  assert.deepEqual(finderItems(state, projects).map((item) => item.kind), ['folder', 'folder', 'folder'])
})

test('Single-click selection does not navigate; opening a folder changes the existing location', () => {
  const selected = run({ type: 'select', id: 'project:test-alpha' })
  assert.equal(finderLocation(selected), null)
  assert.equal(selected.selection, 'project:test-alpha')
  const opened = finderReducer(selected, { type: 'navigate', location: 'test-alpha' }, projectFixtures)
  assert.equal(finderLocation(opened), 'test-alpha')
  assert.equal(opened.selection, null)
  assert.deepEqual(finderItems(opened, projectFixtures).map((item) => item.title), ['TEST FIXTURE resource'])
})

test('History supports back/forward and drops the forward branch on a new navigation', () => {
  const state = run({ type: 'navigate', location: 'test-alpha' }, { type: 'navigate', location: 'test-beta' }, { type: 'back' })
  assert.equal(finderLocation(state), 'test-alpha')
  assert.equal(finderLocation(finderReducer(state, { type: 'forward' }, projectFixtures)), 'test-beta')
  const branched = finderReducer(state, { type: 'navigate', location: 'test-gamma' }, projectFixtures)
  assert.deepEqual(branched.history, [null, 'test-alpha', 'test-gamma'])
  assert.equal(finderReducer(branched, { type: 'forward' }, projectFixtures), branched)
  const root = initialFinderState()
  assert.equal(finderReducer(root, { type: 'back' }, projectFixtures), root)
})

test('Root breadcrumb is a real navigation and opening the current location does not duplicate history', () => {
  const state = run({ type: 'navigate', location: 'test-alpha' }, { type: 'navigate', location: null }, { type: 'navigate', location: null })
  assert.deepEqual(state.history, [null, 'test-alpha', null])
  assert.equal(projectPath('test-alpha', projectFixtures), '/ishtiyak/projects/test-alpha-folder')
  assert.equal(projectPath(null, projectFixtures), PROJECTS_ROOT)
})

test('List/grid changes preserve valid selection and location', () => {
  const state = run({ type: 'navigate', location: 'test-alpha' }, { type: 'select', id: 'resource:test-resource' }, { type: 'view', view: 'grid' })
  assert.equal(state.view, 'grid')
  assert.equal(finderLocation(state), 'test-alpha')
  assert.equal(state.selection, 'resource:test-resource')
})

test('Search is case-insensitive across titles and configured descriptions', () => {
  assert.deepEqual(searchProjects('aLPHa', projectFixtures).map((project) => project.id), ['test-alpha'])
  assert.deepEqual(searchProjects('GEOSPATIAL', projectFixtures).map((project) => project.id), ['test-alpha'])
  assert.equal(searchProjects('missing-project', projectFixtures).length, 0)
})

test('Search scope is all projects, and clearing returns to the current folder', () => {
  const state = run({ type: 'navigate', location: 'test-alpha' }, { type: 'search', value: 'beta' })
  assert.equal(finderLocation(state), 'test-alpha')
  assert.deepEqual(finderItems(state, projectFixtures).map((item) => item.id), ['project:test-beta'])
  const cleared = finderReducer(state, { type: 'search', value: '' }, projectFixtures)
  assert.deepEqual(finderItems(cleared, projectFixtures).map((item) => item.id), ['resource:test-resource'])
})

test('Search preserves matching selection and clears stale selection on no results', () => {
  const selected = run({ type: 'select', id: 'project:test-alpha' }, { type: 'search', value: 'alpha' })
  assert.equal(selected.selection, 'project:test-alpha')
  const none = finderReducer(selected, { type: 'search', value: 'no matches' }, projectFixtures)
  assert.equal(none.selection, null)
  assert.deepEqual(finderItems(none, projectFixtures), [])
})

test('Folders without resources remain navigable and invalid resources are omitted', () => {
  const state = run({ type: 'navigate', location: 'test-beta' })
  assert.equal(finderLocation(state), 'test-beta')
  assert.deepEqual(finderItems(state, projectFixtures), [])
  assert.equal(projectResources(projectFixtures[0]).length, 1)
  assert.equal(validProjectResource({ ...projectFixtures[0].resources[0], href: 'https://user:secret@example.invalid' }), false)
  assert.equal(validProjectResource({ ...projectFixtures[0].resources[0], href: '/absent.pdf', destination: 'local' }), false)
})

test('Valid ID, slug, and logical path requests work; invalid requests leave all Finder state intact', () => {
  for (const target of ['test-alpha', 'test-alpha-folder', '/ishtiyak/projects/test-alpha-folder']) {
    assert.equal(resolveProjectLocation(target, projectFixtures), 'test-alpha')
    assert.equal(finderLocation(run({ type: 'request', target })), 'test-alpha')
  }
  const state = run({ type: 'navigate', location: 'test-beta' }, { type: 'view', view: 'grid' }, { type: 'search', value: 'data' })
  assert.equal(finderReducer(state, { type: 'request', target: 'missing-project' }, projectFixtures), state)
  assert.equal(finderReducer(state, { type: 'select', id: 'resource:missing' }, projectFixtures), state)
  assert.equal(resolveProjectLocation(PROJECTS_ROOT, projectFixtures), null)
})

test('Window requests preserve a Finder instance on minimize/restore and clear requests on fresh reopen', () => {
  const opened = windowReducer(initialWindowState, { type: 'open', appId: 'projects', resourceId: projects[0].id })
  const minimized = windowReducer(opened, { type: 'minimize', appId: 'projects' })
  const restored = windowReducer(minimized, { type: 'open', appId: 'projects' })
  assert.equal(restored.windows[0].instanceId, opened.windows[0].instanceId)
  assert.equal(restored.windows[0].resourceRequest, opened.windows[0].resourceRequest)
  const reopened = windowReducer(windowReducer(restored, { type: 'close', appId: 'projects' }), { type: 'open', appId: 'projects' })
  assert.notEqual(reopened.windows[0].instanceId, opened.windows[0].instanceId)
  assert.equal(reopened.windows[0].resourceRequest, undefined)
})

test('Verified project references can resolve without inventing production skill relationships', () => {
  const destination = { applicationId: 'projects' as const, resourceId: projects[0].id, label: projects[0].title }
  assert.deepEqual(resolveSkillWork({ ...skills[0], relatedWork: [destination] }, [destination]), [destination])
  assert.ok(skills.every((skill) => !skill.relatedWork?.length))
})
