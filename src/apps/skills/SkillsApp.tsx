import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { skills, skillCategories } from '../../data/skills'
import type { Skill } from '../../data/skills'
import { useWindowManager } from '../../hooks/useWindowManager'
import { SkillIcon } from './SkillIcon'
import { resolveSkillWork } from './relatedWork'
import type { RelatedWorkDestination } from './relatedWork'
import './skills.css'

interface SkillsAppProps {
  resources?: readonly RelatedWorkDestination[]
  onSelectResource?: (destination: RelatedWorkDestination) => void
}
interface SkillPreview { id: string; left: number; width: number; above: boolean; pinned: boolean }

function previewFor(skill: Skill, button: HTMLButtonElement, pinned = false): SkillPreview {
  const bounds = button.closest('.app-window__content')!.getBoundingClientRect()
  const tile = button.getBoundingClientRect()
  const width = Math.min(240, bounds.width - 24)
  const left = Math.max(bounds.left + 12, Math.min(tile.left + tile.width / 2 - width / 2, bounds.right - width - 12)) - tile.left
  return { id: skill.id, left, width, above: tile.top - bounds.top > 130, pinned }
}

export function SkillsApp({ resources = [], onSelectResource }: SkillsAppProps) {
  const [preview, setPreview] = useState<SkillPreview | null>(null)
  const root = useRef<HTMLElement>(null)
  const focusFrame = useRef<number | null>(null)
  const { openApp } = useWindowManager()

  useEffect(() => {
    const content = root.current?.closest('.app-window__content')
    const dismiss = () => setPreview(null)
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) dismiss()
    }
    function onScroll() {
      const button = document.activeElement
      const skill = skills.find((item) => item.id === button?.getAttribute('data-skill-id'))
      if (skill && button instanceof HTMLButtonElement && root.current?.contains(button) && button.matches(':focus-visible')) {
        const bounds = content!.getBoundingClientRect()
        const tile = button.getBoundingClientRect()
        setPreview(tile.bottom > bounds.top && tile.top < bounds.bottom ? previewFor(skill, button) : null)
      } else dismiss()
    }
    content?.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', dismiss)
    document.addEventListener('pointerdown', outside)
    return () => {
      content?.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', dismiss)
      document.removeEventListener('pointerdown', outside)
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current)
    }
  }, [])

  function show(skill: Skill, button: HTMLButtonElement, pinned = false) {
    setPreview(previewFor(skill, button, pinned))
  }

  return (
    <article className="skills-app" ref={root} aria-labelledby="toolkit-heading" onKeyDown={(event) => {
      if (event.key === 'Escape') {
        if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current)
        setPreview(null)
      }
    }}>
      <header className="skills-app__intro"><h2 id="toolkit-heading">My Toolkit.</h2><p>Tools I use to turn ideas into working systems.</p></header>
      {skillCategories.map((category) => (
        <section className="skill-category" key={category.id} aria-labelledby={`skill-category-${category.id}`}>
          <h3 id={`skill-category-${category.id}`}>{category.name}</h3>
          <ul className="skill-grid">
            {skills.filter((skill) => skill.category === category.id).map((skill) => {
              const selected = preview?.id === skill.id
              const related = onSelectResource ? resolveSkillWork(skill, resources) : []
              return (
                <li key={skill.id} className="skill-tile"
                  onPointerLeave={(event) => { if (preview?.id === skill.id && !preview.pinned && !event.currentTarget.contains(document.activeElement)) setPreview(null) }}
                  onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPreview(null) }}>
                  <button type="button" className="skill-tile__button" data-skill-id={skill.id} aria-label={skill.name}
                    aria-expanded={selected} aria-controls={selected ? `skill-details-${skill.id}` : undefined}
                    aria-describedby={selected ? `skill-description-${skill.id}` : undefined}
                    onPointerEnter={(event) => { if (event.pointerType !== 'touch' && !preview?.pinned) show(skill, event.currentTarget) }}
                    onFocus={(event) => {
                      const button = event.currentTarget
                      show(skill, button)
                      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current)
                      focusFrame.current = requestAnimationFrame(() => {
                        if (document.activeElement === button) {
                          setPreview((current) => current?.pinned ? current : previewFor(skill, button))
                        }
                      })
                    }}
                    onClick={(event) => { if (selected && preview.pinned) setPreview(null); else show(skill, event.currentTarget, true) }}>
                    <SkillIcon icon={skill.icon} /><span>{skill.name}</span>
                  </button>
                  {selected && <div className="skill-popover" role="region" aria-label={`${skill.name} details`} id={`skill-details-${skill.id}`}
                    data-above={preview.above} style={{ '--popover-left': `${preview.left}px`, '--popover-width': `${preview.width}px` } as CSSProperties}>
                    <strong>{skill.name}</strong><p id={`skill-description-${skill.id}`}>{skill.description}</p>
                    {related.map((destination) => <button type="button" key={`${destination.applicationId}-${destination.resourceId}`} onClick={() => { openApp(destination.applicationId, destination.resourceId); onSelectResource?.(destination) }}>{destination.label}</button>)}
                  </div>}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </article>
  )
}
