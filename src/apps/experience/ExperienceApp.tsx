import { useEffect, useLayoutEffect, useMemo, useReducer, useRef } from 'react'
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react'
import { experiences, formatExperienceDates, safeExperienceLinks, sortExperiences } from '../../data/experience'
import type { Experience } from '../../data/experience'
import type { ResourceRequest } from '../../app/windowState'
import { skills } from '../../data/skills'
import { experienceSelection, initialExperienceSelection } from './experienceSelection'
import type { ExperienceSelection, ExperienceSelectionAction } from './experienceSelection'
import './experience.css'

interface ExperienceAppProps { entries?: readonly Experience[]; selectionRequest?: ResourceRequest }

export function ExperienceApp({ entries = experiences, selectionRequest }: ExperienceAppProps) {
  const ordered = useMemo(() => sortExperiences(entries), [entries])
  const [selection, dispatch] = useReducer((state: ExperienceSelection, action: ExperienceSelectionAction) => experienceSelection(state, action, ordered), ordered, initialExperienceSelection)
  const selected = ordered.find((entry) => entry.id === selection.selectedId)
  const root = useRef<HTMLElement>(null)
  const detail = useRef<HTMLElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const listButtons = useRef(new Map<string, HTMLButtonElement>())
  const pendingFocus = useRef<'details' | 'list' | null>(null)

  useEffect(() => {
    if (selectionRequest && ordered.some((entry) => entry.id === selectionRequest.resourceId)) {
      pendingFocus.current = 'details'
      dispatch({ type: 'select', id: selectionRequest.resourceId })
    }
  }, [selectionRequest, ordered])

  useLayoutEffect(() => {
    if (pendingFocus.current === 'details') heading.current?.focus({ preventScroll: true })
    if (pendingFocus.current === 'list' && selection.selectedId) listButtons.current.get(selection.selectedId)?.focus({ preventScroll: true })
    pendingFocus.current = null
  }, [selection])

  useLayoutEffect(() => {
    if (detail.current) detail.current.scrollTop = 0
  }, [selection.selectedId])

  function select(id: string) {
    if (root.current && root.current.clientWidth <= 540) pendingFocus.current = 'details'
    dispatch({ type: 'select', id })
  }

  const relevantSkills = selected?.technologies?.flatMap((id) => {
    const skill = skills.find((item) => item.id === id)
    return skill ? [skill] : []
  }) ?? []

  return (
    <article className="experience-app" ref={root} data-view={selection.view} aria-label="Professional experience">
      <div className="experience-layout">
        <nav className="experience-history" aria-labelledby="work-history-heading">
          <h2 id="work-history-heading">Work History</h2>
          {ordered.length ? <ul>{ordered.map((entry) => (
            <li key={entry.id}><button type="button" className="experience-entry" aria-current={selected?.id === entry.id ? 'true' : undefined}
              aria-label={`${entry.employer} — ${entry.role}`} aria-controls="experience-detail"
              ref={(button) => { if (button) listButtons.current.set(entry.id, button); else listButtons.current.delete(entry.id) }}
              onClick={() => select(entry.id)}>
              <span className="experience-entry__employer">{entry.employer}</span>
              <span className="experience-entry__role">{entry.role}</span>
              <span className="experience-entry__dates">{formatExperienceDates(entry, true)}</span>
            </button></li>
          ))}</ul> : <p className="experience-history__empty">No positions added yet.</p>}
        </nav>
        <section className="experience-detail" ref={detail} id="experience-detail" aria-labelledby="experience-role-heading" tabIndex={0}>
          <button type="button" className="experience-back" onClick={() => { pendingFocus.current = 'list'; dispatch({ type: 'back' }) }}>
            <ArrowLeft size={15} aria-hidden="true" /> Back to Work History
          </button>
          {selected ? <>
            <header className="experience-detail__identity">
              <h2 id="experience-role-heading" ref={heading} tabIndex={-1}>{selected.role}</h2>
              <p className="experience-detail__employer">{selected.employer}</p>
              <p className="experience-detail__dates">{formatExperienceDates(selected)}</p>
              <p className="experience-detail__location"><MapPin size={13} aria-hidden="true" />{selected.location}</p>
            </header>
            {selected.summary && <p className="experience-detail__summary">{selected.summary}</p>}
            {!!selected.accomplishments?.length && <section className="experience-detail__accomplishments" aria-labelledby="experience-contributions-heading">
              <h3 id="experience-contributions-heading">Selected contributions</h3>
              <ul>{selected.accomplishments.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>}
            {!selected.summary && !selected.accomplishments?.length && <p className="experience-detail__pending">Role details are being prepared.</p>}
            {!!relevantSkills.length && <section className="experience-detail__skills" aria-label="Relevant technologies"><h3>Relevant technologies</h3><ul>{relevantSkills.map((skill) => <li key={skill.id}>{skill.name}</li>)}</ul></section>}
            {!!safeExperienceLinks(selected).length && <ul className="experience-detail__links">{safeExperienceLinks(selected).map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (opens in a new tab)`}>{link.label}<ArrowUpRight size={13} aria-hidden="true" /></a></li>)}</ul>}
          </> : <div className="experience-detail__empty"><h2 id="experience-role-heading">No experience to display</h2><p>Work history will appear here when available.</p></div>}
        </section>
      </div>
    </article>
  )
}
