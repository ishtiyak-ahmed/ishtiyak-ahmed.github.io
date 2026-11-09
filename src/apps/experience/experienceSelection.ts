import { sortExperiences } from '../../data/experience.ts'
import type { Experience } from '../../data/experience.ts'

export interface ExperienceSelection { selectedId: string | null; view: 'list' | 'details' }
export type ExperienceSelectionAction = { type: 'select'; id: string } | { type: 'back' }

export function initialExperienceSelection(entries: readonly Experience[]): ExperienceSelection {
  return { selectedId: sortExperiences(entries)[0]?.id ?? null, view: 'list' }
}

export function experienceSelection(state: ExperienceSelection, action: ExperienceSelectionAction, entries: readonly Experience[]): ExperienceSelection {
  if (action.type === 'back') return { ...state, view: 'list' }
  if (!entries.some((entry) => entry.id === action.id)) return state
  return { selectedId: action.id, view: 'details' }
}
