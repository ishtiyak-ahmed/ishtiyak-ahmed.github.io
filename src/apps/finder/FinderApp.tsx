import { useEffect, useLayoutEffect, useReducer, useRef } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight, Folder, Link, Grid2X2, List, Search, X } from 'lucide-react'
import { isReportPublished, projectHash, PROJECTS_ROOT, projects, projectPath, resolveProjectLocation } from '../../data/projects'
import type { Project } from '../../data/projects'
import type { ResourceRequest } from '../../app/windowState'
import { finderItems, finderLocation, finderReducer, initialFinderState } from './finderState'
import type { FinderAction, FinderItem, FinderState } from './finderState'
import { resourcePresentation } from './resourcePresentation'
import './finder.css'

interface FinderAppProps { entries?: readonly Project[]; selectionRequest?: ResourceRequest; onNavigate?: (location: string | null) => void }

export function FinderApp({ entries = projects, selectionRequest, onNavigate }: FinderAppProps) {
  const [state, dispatch] = useReducer((current: FinderState, action: FinderAction) => finderReducer(current, action, entries), undefined, initialFinderState)
  const heading = useRef<HTMLHeadingElement>(null)
  const content = useRef<HTMLElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const focusHeading = useRef(false)
  const location = finderLocation(state)
  const project = entries.find((item) => item.id === location)
  const searching = !!state.search.trim()
  const items = finderItems(state, entries)
  const selected = items.find((item) => item.id === state.selection)

  useEffect(() => {
    if (selectionRequest && resolveProjectLocation(selectionRequest.resourceId, entries) !== undefined) {
      focusHeading.current = true
      dispatch({ type: 'request', target: selectionRequest.resourceId })
    }
  }, [selectionRequest, entries])

  useLayoutEffect(() => {
    if (focusHeading.current) {
      heading.current?.focus({ preventScroll: true })
      focusHeading.current = false
    }
  }, [state])
  useLayoutEffect(() => { if (content.current) content.current.scrollTop = 0 }, [location, searching])

  function navigate(action: FinderAction) {
    focusHeading.current = true
    const next = finderReducer(state, action, entries)
    dispatch(action)
    if (next !== state) onNavigate?.(finderLocation(next))
  }
  function open(item: FinderItem) {
    if (item.kind === 'folder') navigate({ type: 'navigate', location: item.project.id })
    else window.open(item.resource.href, '_blank', 'noopener,noreferrer')
  }

  return (
    <article className="finder-app" aria-label="Project explorer">
      <div className="finder-layout">
        <nav className="finder-sidebar" aria-label="Project locations">
          <button type="button" aria-label="Projects root" aria-current={location === null && !searching ? 'location' : undefined} onClick={() => navigate({ type: 'navigate', location: null })}><Folder size={16} aria-hidden="true" /><span>Projects</span></button>
        </nav>
        <div className="finder-main">
          <div className="finder-toolbar" aria-label="Finder navigation">
            <div className="finder-toolbar__navigation">
              <button type="button" aria-label="Back" disabled={state.historyIndex === 0} onClick={() => navigate({ type: 'back' })}><ArrowLeft size={16} aria-hidden="true" /></button>
              <button type="button" aria-label="Forward" disabled={state.historyIndex === state.history.length - 1} onClick={() => navigate({ type: 'forward' })}><ArrowRight size={16} aria-hidden="true" /></button>
              <button type="button" className="finder-open" disabled={!selected} onClick={() => { if (selected) open(selected) }}>Open<span className="sr-only"> selected item</span></button>
            </div>
            <div className="finder-search">
              <Search size={14} aria-hidden="true" /><input ref={search} type="search" aria-label="Search projects" placeholder="Search projects" value={state.search} onChange={(event) => dispatch({ type: 'search', value: event.target.value })} />
              {state.search && <button type="button" aria-label="Clear search" onClick={() => { dispatch({ type: 'search', value: '' }); search.current?.focus() }}><X size={14} aria-hidden="true" /></button>}
            </div>
            <div className="finder-view" aria-label="View options">
              <button type="button" aria-label="List view" aria-pressed={state.view === 'list'} onClick={() => dispatch({ type: 'view', view: 'list' })}><List size={16} aria-hidden="true" /></button>
              <button type="button" aria-label="Grid view" aria-pressed={state.view === 'grid'} onClick={() => dispatch({ type: 'view', view: 'grid' })}><Grid2X2 size={16} aria-hidden="true" /></button>
            </div>
          </div>
          <nav className="finder-breadcrumbs" aria-label="Project path">
            <span className="finder-breadcrumbs__owner">ishtiyak</span><ChevronRight size={12} aria-hidden="true" />
            <button type="button" aria-current={location === null ? 'page' : undefined} onClick={() => navigate({ type: 'navigate', location: null })}>Projects</button>
            {project && <><ChevronRight size={12} aria-hidden="true" /><button type="button" aria-current="page" onClick={() => navigate({ type: 'navigate', location: project.id })}>{project.title}</button></>}
          </nav>
          <section className="finder-content" ref={content} aria-labelledby="finder-content-heading" tabIndex={0}>
            <header className="finder-content__header">
              <h2 id="finder-content-heading" ref={heading} tabIndex={-1}>{searching ? 'Search results' : project?.title ?? 'Projects'}</h2>
              {searching ? <p>Searching all projects · {items.length} {items.length === 1 ? 'result' : 'results'}</p> : project && <p>{project.shortDescription ?? 'Project overview is not available yet.'}</p>}
              {!searching && project && !isReportPublished(project) && <p>Project report not yet published.</p>}
            </header>
            {!!items.length && <ul className={`finder-items finder-items--${state.view}`} aria-label={searching || !project ? 'Project folders' : 'Project resources'}>
              {items.map((item) => {
                const Icon = item.kind === 'folder' ? Folder : resourcePresentation[item.resource.type].icon
                return <li key={item.id} className="finder-item" data-selected={state.selection === item.id}>
                  <button type="button" className="finder-item__select" aria-label={item.title} aria-pressed={state.selection === item.id}
                    onClick={() => dispatch({ type: 'select', id: item.id })} onDoubleClick={() => open(item)}
                    onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); open(item) } }}>
                    <Icon className={item.kind === 'folder' ? 'finder-folder-icon' : ''} size={state.view === 'grid' ? 32 : 20} aria-hidden="true" />
                    <span><span className="finder-item__title">{item.title}</span>{item.kind === 'folder' && item.project.category && <span className="finder-item__metadata">{item.project.category}</span>}{item.kind === 'resource' && <span className="finder-item__metadata">{item.resource.description ?? resourcePresentation[item.resource.type].label}</span>}</span>
                  </button>
                  {item.kind === 'folder' ? <button type="button" className="finder-item__open" aria-label={`Open ${item.title}`} onClick={() => open(item)}><ChevronRight size={16} aria-hidden="true" /></button> : <a className="finder-item__open" href={item.resource.href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.title} (opens in a new tab)`}>{item.resource.destination === 'external' ? <ArrowUpRight size={16} aria-hidden="true" /> : <Link size={16} aria-hidden="true" />}</a>}
                </li>
              })}
            </ul>}
            {!items.length && <p className="finder-empty" role="status">{searching ? 'No projects match your search.' : project ? 'No verified resource links have been added yet.' : 'No projects have been added yet.'}</p>}
          </section>
          <footer className="finder-status">{onNavigate && <a href={projectHash(location, entries)} aria-label="Shareable project link">Project link</a>}<span title={projectPath(location, entries)}>{searching ? 'All projects' : projectPath(location, entries)}</span><span>{items.length} {items.length === 1 ? 'item' : 'items'}</span></footer>
        </div>
      </div>
      <span className="sr-only">Project root: {PROJECTS_ROOT}</span>
    </article>
  )
}
