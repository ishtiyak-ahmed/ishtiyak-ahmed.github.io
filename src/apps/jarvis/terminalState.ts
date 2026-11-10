import { applications, dockOrder } from '../../data/apps.ts'
import { projects } from '../../data/projects.ts'
import { bootLines, commandRegistry } from './commands.ts'
import type { CommandResult, TerminalLine } from './commands.ts'
export const TRANSCRIPT_LIMIT = 120
export const HISTORY_LIMIT = 100
export const INPUT_LIMIT = 2000
export interface TranscriptEntry { id: number; command?: string; boot?: boolean; lines: TerminalLine[] }
export interface TerminalState {
  entries: TranscriptEntry[]; history: string[]; cursor: number | null; draft: string; input: string
  bootIndex: number; bootLength: number; nextId: number
}
export function initialTerminalState(): TerminalState {
  const lines = bootLines()
  return { entries: [{ id: 0, boot: true, lines }], history: [], cursor: null, draft: '', input: '', bootIndex: 1, bootLength: lines.length, nextId: 1 }
}
export type TerminalAction =
  | { type: 'input'; value: string }
  | { type: 'boot-tick' | 'skip-boot' | 'older' | 'newer' }
  | { type: 'submit'; command: string; result: CommandResult }
  | { type: 'suggest'; candidates: string[] }
export function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case 'boot-tick': return { ...state, bootIndex: Math.min(state.bootLength, state.bootIndex + 1) }
    case 'skip-boot': return { ...state, bootIndex: state.bootLength }
    case 'input': return { ...state, input: action.value.slice(0, INPUT_LIMIT), cursor: null }
    case 'older': {
      if (!state.history.length) return state
      const cursor = state.cursor === null ? state.history.length - 1 : Math.max(0, state.cursor - 1)
      return { ...state, cursor, input: state.history[cursor], draft: state.cursor === null ? state.input : state.draft }
    }
    case 'newer': {
      if (state.cursor === null) return state
      const cursor = state.cursor + 1
      return cursor >= state.history.length ? { ...state, cursor: null, input: state.draft } : { ...state, cursor, input: state.history[cursor] }
    }
    case 'submit': {
      if (!action.command.trim()) return state
      const history = [...state.history, action.command].slice(-HISTORY_LIMIT)
      const entry = { id: state.nextId, command: action.command, lines: action.result.lines }
      return { ...state, history, entries: action.result.clear ? [] : [...state.entries, entry].slice(-TRANSCRIPT_LIMIT), input: '', cursor: null, draft: '', nextId: state.nextId + 1 }
    }
    case 'suggest': return { ...state, entries: [...state.entries, { id: state.nextId, lines: [{ text: `Completions: ${action.candidates.join(' · ')}`, tone: 'info' as const }] }].slice(-TRANSCRIPT_LIMIT), nextId: state.nextId + 1 }
  }
}
export function completeCommand(input: string): { input: string; candidates: string[] } {
  const candidates = [
    ...commandRegistry.map((command) => command.name),
    ...['projects', 'experience', 'skills'].map((directory) => `ls ${directory}`),
    'cat resume', ...['resume', 'github', 'linkedin'].map((resource) => `open ${resource}`),
    ...dockOrder.flatMap((id) => [`open -a ${id}`, `open -a "${applications[id].name}"`]),
    ...projects.map((project) => `open project ${project.id}`),
  ]
  const prefix = input.trimStart().toLowerCase()
  if (!prefix) return { input, candidates: commandRegistry.map((command) => command.name) }
  const matches = [...new Set(candidates)].filter((candidate) => candidate.toLowerCase().startsWith(prefix))
  return matches.length === 1 ? { input: `${matches[0]} `, candidates: [] } : { input, candidates: matches }
}
