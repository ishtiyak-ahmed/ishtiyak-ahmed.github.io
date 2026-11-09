import assert from 'node:assert/strict'
import { test } from 'node:test'
import { activeApplicationId, initialWindowState, windowReducer } from '../src/app/windowState.ts'
import type { WindowAction, WindowState } from '../src/app/windowState.ts'

function run(...actions: WindowAction[]): WindowState {
  return actions.reduce(windowReducer, initialWindowState)
}

test('repeated launches keep one instance and raise the selected application', () => {
  const state = run({ type: 'open', appId: 'projects' }, { type: 'open', appId: 'education' }, { type: 'open', appId: 'projects' })
  assert.deepEqual(state.windows.map((window) => window.appId), ['education', 'projects'])
  assert.equal(state.windows[1].instanceId, 1)
  assert.equal(activeApplicationId(state), 'projects')
})

test('minimizing retains instance and expansion; dock launch restores both', () => {
  const minimized = run({ type: 'open', appId: 'projects' }, { type: 'toggleExpand', appId: 'projects' }, { type: 'minimize', appId: 'projects' })
  assert.equal(activeApplicationId(minimized), 'home')
  assert.equal(minimized.windows.length, 1)
  const restored = windowReducer(minimized, { type: 'open', appId: 'projects' })
  assert.equal(restored.windows[0].instanceId, minimized.windows[0].instanceId)
  assert.equal(restored.windows[0].expanded, true)
  assert.equal(restored.windows[0].minimized, false)
})

test('closing and immediately reopening creates a fresh normal instance', () => {
  const opened = run({ type: 'open', appId: 'projects' }, { type: 'toggleExpand', appId: 'projects' })
  const closed = windowReducer(opened, { type: 'close', appId: 'projects' })
  assert.equal(closed.windows.length, 0)
  const reopened = windowReducer(closed, { type: 'open', appId: 'projects' })
  assert.notEqual(reopened.windows[0].instanceId, opened.windows[0].instanceId)
  assert.equal(reopened.windows[0].expanded, false)
  assert.equal(reopened.windows[0].minimized, false)
})

test('Home minimizes every window without changing instance, order, or expansion', () => {
  const opened = run({ type: 'open', appId: 'projects' }, { type: 'toggleExpand', appId: 'projects' }, { type: 'open', appId: 'education' })
  const home = windowReducer(opened, { type: 'open', appId: 'home' })
  assert.equal(activeApplicationId(home), 'home')
  assert.deepEqual(home.windows, opened.windows.map((window) => ({ ...window, minimized: true })))
  const restored = windowReducer(home, { type: 'restore', appId: 'projects' })
  assert.equal(activeApplicationId(restored), 'projects')
  assert.equal(restored.windows[1].expanded, true)
})

test('closing or minimizing the foreground selects the next visible window, skipping minimized ones', () => {
  const state = run({ type: 'open', appId: 'projects' }, { type: 'open', appId: 'education' }, { type: 'minimize', appId: 'education' }, { type: 'open', appId: 'skills' })
  assert.equal(activeApplicationId(windowReducer(state, { type: 'close', appId: 'skills' })), 'projects')
  assert.equal(activeApplicationId(windowReducer(state, { type: 'minimize', appId: 'skills' })), 'projects')
  const minimized = windowReducer(state, { type: 'showDesktop' })
  assert.equal(activeApplicationId(windowReducer(minimized, { type: 'close', appId: 'skills' })), 'home')
})

test('focusing a background window changes stack order without changing other state', () => {
  const opened = run({ type: 'open', appId: 'projects' }, { type: 'open', appId: 'education' })
  const focused = windowReducer(opened, { type: 'focus', appId: 'projects' })
  assert.equal(activeApplicationId(focused), 'projects')
  assert.deepEqual(focused.windows, [opened.windows[1], opened.windows[0]])
  assert.equal(windowReducer(focused, { type: 'focus', appId: 'projects' }), focused)
})

test('Projects, Beyond the Data, Technical Skills, and Experience expand and return to normal', () => {
  for (const appId of ['projects', 'jarvis', 'skills', 'experience'] as const) {
    const opened = run({ type: 'open', appId })
    const expanded = windowReducer(opened, { type: 'toggleExpand', appId })
    assert.equal(expanded.windows[0].expanded, true)
    assert.equal(windowReducer(expanded, { type: 'toggleExpand', appId }).windows[0].expanded, false)
  }
  for (const appId of ['education', 'contact'] as const) {
    const opened = run({ type: 'open', appId })
    assert.equal(windowReducer(opened, { type: 'toggleExpand', appId }), opened)
  }
})

test('stale actions cannot reopen closed windows or activate minimized windows', () => {
  assert.equal(windowReducer(initialWindowState, { type: 'restore', appId: 'projects' }), initialWindowState)
  const minimized = run({ type: 'open', appId: 'projects' }, { type: 'minimize', appId: 'projects' })
  assert.equal(windowReducer(minimized, { type: 'focus', appId: 'projects' }), minimized)
  assert.equal(windowReducer(minimized, { type: 'toggleExpand', appId: 'projects' }), minimized)
})

test('Experience uses the same single-instance lifecycle and preserves expansion on restore', () => {
  const opened = run({ type: 'open', appId: 'experience' }, { type: 'open', appId: 'experience' }, { type: 'toggleExpand', appId: 'experience' })
  assert.equal(opened.windows.length, 1)
  assert.equal(activeApplicationId(opened), 'experience')
  const home = windowReducer(opened, { type: 'showDesktop' })
  assert.equal(home.windows[0].expanded, true)
  const restored = windowReducer(home, { type: 'open', appId: 'experience' })
  assert.equal(restored.windows[0].instanceId, opened.windows[0].instanceId)
  assert.equal(restored.windows[0].expanded, true)
  const closed = windowReducer(restored, { type: 'close', appId: 'experience' })
  assert.equal(closed.windows.length, 0)
  const reopened = windowReducer(closed, { type: 'open', appId: 'experience' })
  assert.equal(reopened.windows[0].expanded, false)
  assert.notEqual(reopened.windows[0].instanceId, opened.windows[0].instanceId)
})
