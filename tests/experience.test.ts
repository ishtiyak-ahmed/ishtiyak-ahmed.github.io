import assert from 'node:assert/strict'
import { test } from 'node:test'
import { experiences, formatExperienceDates, safeExperienceLinks, sortExperiences } from '../src/data/experience.ts'
import { initialExperienceSelection, experienceSelection } from '../src/apps/experience/experienceSelection.ts'
import { initialWindowState, windowReducer } from '../src/app/windowState.ts'
import { experienceFixtures } from './fixtures/experiences.ts'

test('Production experience contains only confirmed role metadata and no invented details', () => {
  assert.deepEqual(experiences, [{ id: 'e-aferi-research-project-support-2026', employer: 'E. Aferi', role: 'Research and Project Support Intern', startDate: '2026-01', endDate: '2026-04', location: 'Toronto, Ontario' }])
  assert.equal(formatExperienceDates(experiences[0]), 'January 2026 – April 2026')
  assert.equal(new Set(experiences.map((entry) => entry.id)).size, experiences.length)
})

test('Multiple fixture entries sort newest first without modifying their input, including repeated employers', () => {
  assert.deepEqual(sortExperiences(experienceFixtures).map((entry) => entry.id), ['test-role-newest', 'test-role-middle', 'test-role-older'])
  assert.equal(experienceFixtures[0].id, 'test-role-older')
  assert.equal(experienceFixtures.filter((entry) => entry.employer === 'TEST FIXTURE Studio').length, 2)
})

test('Default selection is the newest entry, with compact layout initially showing the list', () => {
  assert.deepEqual(initialExperienceSelection(experienceFixtures), { selectedId: 'test-role-newest', view: 'list' })
})

test('Selecting another fixture updates the detail identity and optional content', () => {
  const selected = experienceSelection(initialExperienceSelection(experienceFixtures), { type: 'select', id: 'test-role-older' }, experienceFixtures)
  assert.deepEqual(selected, { selectedId: 'test-role-older', view: 'details' })
  const entry = experienceFixtures.find((item) => item.id === selected.selectedId)!
  assert.equal(entry.role, 'TEST FIXTURE Earlier Role')
  assert.equal(entry.summary, undefined)
  assert.equal(entry.accomplishments, undefined)
  assert.deepEqual(safeExperienceLinks(entry), [])
})

test('Back navigation preserves selection, while invalid role requests do not replace it', () => {
  const selected = experienceSelection(initialExperienceSelection(experienceFixtures), { type: 'select', id: 'test-role-middle' }, experienceFixtures)
  const back = experienceSelection(selected, { type: 'back' }, experienceFixtures)
  assert.deepEqual(back, { selectedId: 'test-role-middle', view: 'list' })
  assert.equal(experienceSelection(back, { type: 'select', id: 'not-a-role' }, experienceFixtures), back)
})

test('Empty data has no selection and safely rejects detail selection', () => {
  const state = initialExperienceSelection([])
  assert.deepEqual(state, { selectedId: null, view: 'list' })
  assert.equal(experienceSelection(state, { type: 'select', id: 'missing' }, []), state)
})

test('Optional links require HTTPS, and ongoing dates have a readable fallback', () => {
  const entry = { ...experienceFixtures[0], endDate: undefined, externalLinks: [{ label: 'Safe fixture', href: 'https://example.invalid/test' }, { label: 'Unsafe fixture', href: 'javascript:void(0)' }] }
  assert.equal(formatExperienceDates(entry), 'January 2024 – Present')
  assert.deepEqual(safeExperienceLinks(entry), [{ label: 'Safe fixture', href: 'https://example.invalid/test' }])
})

test('Resource requests restore an existing Experience instance and distinguish repeated requests', () => {
  const first = windowReducer(initialWindowState, { type: 'open', appId: 'experience', resourceId: 'test-role-middle' })
  const minimized = windowReducer(first, { type: 'minimize', appId: 'experience' })
  const restored = windowReducer(minimized, { type: 'open', appId: 'experience' })
  assert.equal(restored.windows[0].resourceRequest, first.windows[0].resourceRequest)
  assert.equal(restored.windows[0].instanceId, first.windows[0].instanceId)
  const repeated = windowReducer(restored, { type: 'open', appId: 'experience', resourceId: 'test-role-middle' })
  assert.notEqual(repeated.windows[0].resourceRequest?.requestId, first.windows[0].resourceRequest?.requestId)
  const closed = windowReducer(repeated, { type: 'close', appId: 'experience' })
  const reopened = windowReducer(closed, { type: 'open', appId: 'experience' })
  assert.equal(reopened.windows[0].resourceRequest, undefined)
  assert.notEqual(reopened.windows[0].instanceId, first.windows[0].instanceId)
})
