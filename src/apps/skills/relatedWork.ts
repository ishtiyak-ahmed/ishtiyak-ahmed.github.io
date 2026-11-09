import { experiences } from '../../data/experience.ts'
import { applications } from '../../data/apps.ts'
import type { RelatedWorkReference, Skill } from '../../data/skills.ts'

export interface RelatedWorkDestination extends RelatedWorkReference { label: string }

// Future Finder/Experience phases supply a verified catalog and selection handler.
// A window opening by itself is not a supported resource destination.
export function resolveSkillWork(skill: Skill, catalog: readonly RelatedWorkDestination[]) {
  return (skill.relatedWork ?? []).flatMap((reference) => {
    if (reference.applicationId === 'experience' && !experiences.some((entry) => entry.id === reference.resourceId)) return []
    if ('placeholder' in applications[reference.applicationId].window) return []
    const destination = catalog.find((item) => item.applicationId === reference.applicationId && item.resourceId === reference.resourceId)
    return destination ? [destination] : []
  })
}
