import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseCommand } from '../src/apps/jarvis/parser.ts'
import { availableTerminalLink, bootLines, commandRegistry, executeCommand, resolveApplication } from '../src/apps/jarvis/commands.ts'
import { completeCommand, HISTORY_LIMIT, initialTerminalState, INPUT_LIMIT, terminalReducer, TRANSCRIPT_LIMIT } from '../src/apps/jarvis/terminalState.ts'
import { applications, dockOrder } from '../src/data/apps.ts'
import { projects } from '../src/data/projects.ts'
import { contactDetails } from '../src/data/contact.ts'
import { education } from '../src/data/education.ts'
import { OS_VERSION } from '../src/data/system.ts'
import { initialWindowState, windowReducer } from '../src/app/windowState.ts'
const output = (command: string) => executeCommand(command).lines.map((line) => line.text).join('\n')
const submit = (state: ReturnType<typeof initialTerminalState>, command: string) => terminalReducer(state, { type: 'submit', command, result: executeCommand(command) })

test('JARVIS normalizes whitespace, preserves quoted arguments, and rejects malformed input', () => {
  assert.deepEqual(parseCommand('  open   -a  "Let\'s Grab a Coffee"  '), { ok: true, tokens: ['open', '-a', "Let's Grab a Coffee"] })
  assert.deepEqual(parseCommand("open project 'ttc-delay-patterns'"), { ok: true, tokens: ['open', 'project', 'ttc-delay-patterns'] })
  assert.equal(parseCommand('open -a "unfinished').ok, false)
  assert.deepEqual(executeCommand('  ').lines, [])
})
test('Unknown commands and unsupported options never execute input as source code', () => {
  for (const command of ['eval alert(1)', 'rm -rf /', '$(whoami)', 'ls --all', 'open --unknown', 'help extra', 'open -a', 'cat', 'ls projects extra']) {
    const result = executeCommand(command)
    assert.equal(result.effect, undefined)
    assert.equal(result.lines[0].tone, 'error')
  }
})
test('Help, status, and aliases reflect actual supported commands and local data', () => {
  for (const command of commandRegistry) assert.ok(output('help').includes(command.usage))
  assert.ok(output('status').includes(OS_VERSION))
  assert.ok(output('status').includes(`${dockOrder.length} applications`))
  assert.ok(output('status').includes(`${projects.length} configured projects`))
  assert.equal(output('?'), output('help'))
  assert.ok(executeCommand('cls').clear)
})
test('Personal, introduction, contact, experience, and skills outputs use configured facts', () => {
  assert.ok(output('whoami').includes(education.major))
  assert.ok(output('whoami').includes(education.expectedGraduation!))
  assert.ok(output('about').includes('Exploring the intersection'))
  assert.ok(output('contact').includes(contactDetails.email!))
  assert.ok(output('ls experience').includes('E. Aferi'))
  assert.ok(output('ls skills').includes('Programming Languages'))
  assert.ok(output('interests').includes('not available'))
  assert.ok(output('cat resume').includes('open resume'))
})
test('Every application accepts its stable ID and quoted display name', () => {
  for (const appId of dockOrder) {
    assert.equal(resolveApplication(appId), appId)
    assert.equal(resolveApplication(applications[appId].name), appId)
    assert.deepEqual(executeCommand(`open -a "${applications[appId].name}"`).effect, { type: 'app', appId })
  }
  assert.equal(resolveApplication('Not an app'), undefined)
  assert.equal(executeCommand('open -a missing').lines[0].tone, 'error')
})
test('Project listings and launch requests retain the shared registry IDs', () => {
  for (const project of projects) {
    assert.ok(output('ls projects').includes(project.title))
    assert.deepEqual(executeCommand(`open project ${project.slug}`).effect, { type: 'app', appId: 'projects', resourceId: project.id })
  }
  assert.equal(executeCommand('open project unknown').effect, undefined)
  assert.equal(executeCommand('open project /ishtiyak/projects').effect, undefined)
})
test('Configured external resources are safe and missing resources never launch', () => {
  for (const kind of ['resume', 'github', 'linkedin']) assert.equal(executeCommand(`open ${kind}`).effect?.type, 'link')
  const missing = { email: null, linkedin: null, github: null, resume: null, phone: null }
  for (const kind of ['resume', 'github', 'linkedin']) {
    assert.equal(executeCommand(`open ${kind}`, missing).effect, undefined)
    assert.equal(executeCommand(`open ${kind}`, missing).lines[0].tone, 'error')
  }
  assert.ok(executeCommand('contact', missing).lines[0].text.includes('not configured'))
  assert.equal(availableTerminalLink('github', { ...missing, github: 'javascript:alert(1)' }), undefined)
  assert.equal(availableTerminalLink('resume', { ...missing, resume: '//evil.invalid/file.pdf' }), undefined)
  assert.equal(availableTerminalLink('resume', { ...missing, resume: '/resume.pdf?redirect=x' }), undefined)
})
test('Boot sequence is bounded, truthfully local, skippable, and not duplicated by repeat ticks', () => {
  const state = initialTerminalState()
  assert.equal(state.entries.length, 1)
  assert.ok(bootLines()[0].text.includes(OS_VERSION))
  const skipped = terminalReducer(state, { type: 'skip-boot' })
  assert.equal(skipped.bootIndex, skipped.bootLength)
  assert.equal(terminalReducer(skipped, { type: 'boot-tick' }).bootIndex, skipped.bootLength)
  assert.equal(terminalReducer(skipped, { type: 'skip-boot' }).entries.length, 1)
})
test('A multi-command session appends output and clear preserves history without rebooting', () => {
  let state = terminalReducer(initialTerminalState(), { type: 'skip-boot' })
  for (const command of ['whoami', 'help', 'ls projects', 'unknown']) state = submit(state, command)
  assert.equal(state.entries.length, 5)
  state = submit(state, 'clear')
  assert.equal(state.entries.length, 0)
  assert.equal(state.history.length, 5)
  assert.equal(state.bootIndex, state.bootLength)
  state = submit(state, 'status')
  assert.equal(state.entries.length, 1)
})
test('Up and Down navigate history and restore unfinished input', () => {
  let state = submit(submit(initialTerminalState(), 'help'), 'status')
  state = terminalReducer(state, { type: 'input', value: 'unfinished draft' })
  state = terminalReducer(state, { type: 'older' })
  assert.equal(state.input, 'status')
  state = terminalReducer(state, { type: 'older' })
  assert.equal(state.input, 'help')
  state = terminalReducer(state, { type: 'newer' })
  assert.equal(state.input, 'status')
  state = terminalReducer(state, { type: 'newer' })
  assert.equal(state.input, 'unfinished draft')
  assert.equal(terminalReducer(initialTerminalState(), { type: 'older' }).input, '')
})
test('Tab completion supports commands, apps, quoted names, projects, and ambiguous matches', () => {
  assert.equal(completeCommand('he').input, 'help ')
  assert.equal(completeCommand('open -a "Beyond').input, 'open -a "Beyond the Data" ')
  assert.equal(completeCommand('open project ttc').input, 'open project ttc-delay-patterns ')
  assert.ok(completeCommand('open -a e').candidates.length > 1)
  assert.equal(completeCommand('open -a e').input, 'open -a e')
  assert.deepEqual(completeCommand('nonsense').candidates, [])
  assert.equal(completeCommand('').candidates.length, commandRegistry.length)
})
test('Transcript, input, history, and suggestions have fixed bounds', () => {
  let state = initialTerminalState()
  for (let i = 0; i < TRANSCRIPT_LIMIT + 20; i++) state = submit(state, 'status')
  assert.equal(state.entries.length, TRANSCRIPT_LIMIT)
  assert.equal(state.history.length, HISTORY_LIMIT)
  state = terminalReducer(state, { type: 'suggest', candidates: ['help', 'status'] })
  assert.equal(state.entries.length, TRANSCRIPT_LIMIT)
  assert.equal(terminalReducer(state, { type: 'input', value: 'x'.repeat(INPUT_LIMIT + 10) }).input.length, INPUT_LIMIT)
})
test('Shared window lifecycle preserves a running terminal and resets only its fresh lifetime', () => {
  const session = submit(terminalReducer(initialTerminalState(), { type: 'skip-boot' }), 'help')
  const opened = windowReducer(initialWindowState, { type: 'open', appId: 'jarvis' })
  const restored = windowReducer(windowReducer(opened, { type: 'minimize', appId: 'jarvis' }), { type: 'open', appId: 'jarvis' })
  assert.equal(restored.windows[0].instanceId, opened.windows[0].instanceId)
  assert.equal(session.history[0], 'help')
  const reopened = windowReducer(windowReducer(restored, { type: 'close', appId: 'jarvis' }), { type: 'open', appId: 'jarvis' })
  assert.notEqual(reopened.windows[0].instanceId, opened.windows[0].instanceId)
  assert.equal(initialTerminalState().history.length, 0)
})
test('Command launch effects use the existing single-instance window reducer', () => {
  let state = initialWindowState
  for (const command of ['open -a education', 'open -a education', 'open project ttc-delay-patterns', 'open project ttc-delay-patterns']) {
    const effect = executeCommand(command).effect
    assert.equal(effect?.type, 'app')
    if (effect?.type === 'app') state = windowReducer(state, { type: 'open', appId: effect.appId, resourceId: effect.resourceId })
  }
  assert.equal(state.windows.length, 2)
  assert.equal(state.windows[1].resourceRequest?.resourceId, projects[0].id)
})
