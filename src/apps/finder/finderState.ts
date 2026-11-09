import { projectResources, resolveProjectLocation, searchProjects } from '../../data/projects.ts'
import type { Project, ProjectResource } from '../../data/projects.ts'

export interface FinderState {
  history: (string | null)[]
  historyIndex: number
  search: string
  view: 'list' | 'grid'
  selection: string | null
}
export type FinderAction =
  | { type: 'navigate'; location: string | null }
  | { type: 'request'; target: string }
  | { type: 'back' | 'forward' }
  | { type: 'select'; id: string }
  | { type: 'search'; value: string }
  | { type: 'view'; view: 'list' | 'grid' }

export type FinderItem =
  | { id: string; kind: 'folder'; title: string; project: Project }
  | { id: string; kind: 'resource'; title: string; resource: ProjectResource }

export function initialFinderState(): FinderState {
  return { history: [null], historyIndex: 0, search: '', view: 'list', selection: null }
}
export function finderLocation(state: FinderState): string | null { return state.history[state.historyIndex] }

export function finderItems(state: FinderState, entries: readonly Project[]): FinderItem[] {
  const location = finderLocation(state)
  if (location === null || state.search.trim()) {
    return searchProjects(state.search, entries).map((project) => ({ id: `project:${project.id}`, kind: 'folder', title: project.title, project }))
  }
  const project = entries.find((item) => item.id === location)
  return project ? projectResources(project).map((resource) => ({ id: `resource:${resource.id}`, kind: 'resource', title: resource.title, resource })) : []
}

function navigate(state: FinderState, location: string | null): FinderState {
  if (finderLocation(state) === location) return { ...state, search: '', selection: null }
  const history = [...state.history.slice(0, state.historyIndex + 1), location]
  return { ...state, history, historyIndex: history.length - 1, search: '', selection: null }
}

export function finderReducer(state: FinderState, action: FinderAction, entries: readonly Project[]): FinderState {
  switch (action.type) {
    case 'navigate':
      return action.location === null || entries.some((item) => item.id === action.location) ? navigate(state, action.location) : state
    case 'request': {
      const location = resolveProjectLocation(action.target, entries)
      return location === undefined ? state : navigate(state, location)
    }
    case 'back':
      return state.historyIndex > 0 ? { ...state, historyIndex: state.historyIndex - 1, search: '', selection: null } : state
    case 'forward':
      return state.historyIndex < state.history.length - 1 ? { ...state, historyIndex: state.historyIndex + 1, search: '', selection: null } : state
    case 'view':
      return { ...state, view: action.view }
    case 'select':
      return finderItems(state, entries).some((item) => item.id === action.id) ? { ...state, selection: action.id } : state
    case 'search': {
      const next = { ...state, search: action.value }
      return { ...next, selection: finderItems(next, entries).some((item) => item.id === state.selection) ? state.selection : null }
    }
  }
}
