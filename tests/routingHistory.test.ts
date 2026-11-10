import assert from 'node:assert/strict'
import { test } from 'node:test'
import { writeHashNavigation } from '../src/routing/browserHistory.ts'

test('Hash navigation writes browser history only for location changes and supports replacement', () => {
  const writes: { method: string; url: string }[] = []
  const location = { pathname: '/', search: '', hash: '' }
  const browser = {
    location,
    history: {
      pushState: (_state: unknown, _title: string, url: string) => { writes.push({ method: 'push', url }); location.hash = new URL(url, 'https://example.invalid').hash },
      replaceState: (_state: unknown, _title: string, url: string) => { writes.push({ method: 'replace', url }); location.hash = new URL(url, 'https://example.invalid').hash },
    },
  }
  assert.ok(writeHashNavigation(browser, '#/projects'))
  assert.equal(writeHashNavigation(browser, '#/projects'), false)
  writeHashNavigation(browser, '#/projects/ttc-delay-patterns')
  writeHashNavigation(browser, '#/', true)
  assert.deepEqual(writes, [
    { method: 'push', url: '/#/projects' },
    { method: 'push', url: '/#/projects/ttc-delay-patterns' },
    { method: 'replace', url: '/#/' },
  ])
})
