export interface ExperienceLink { label: string; href: string }

export interface Experience {
  id: string
  employer: string
  role: string
  /** ISO year-month (YYYY-MM); dates are formatted independently of visitor timezone. */
  startDate: string
  endDate?: string
  location: string
  summary?: string
  accomplishments?: readonly string[]
  /** Stable skill IDs, populated only when an association has been verified. */
  technologies?: readonly string[]
  relatedProjectIds?: readonly string[]
  externalLinks?: readonly ExperienceLink[]
}

// Production contains only confirmed metadata. Detailed wording awaits review.
export const experiences: readonly Experience[] = [
  {
    id: 'e-aferi-research-project-support-2026',
    employer: 'E. Aferi',
    role: 'Research and Project Support Intern',
    startDate: '2026-01',
    endDate: '2026-04',
    location: 'Toronto, Ontario',
  },
]

export function sortExperiences(entries: readonly Experience[]): Experience[] {
  return entries.toSorted((a, b) => b.startDate.localeCompare(a.startDate) || (b.endDate ?? '9999').localeCompare(a.endDate ?? '9999'))
}

export function formatExperienceDates(entry: Experience, concise = false): string {
  const formatter = new Intl.DateTimeFormat('en-US', { month: concise ? 'short' : 'long', year: 'numeric', timeZone: 'UTC' })
  const format = (value: string) => {
    const [year, month] = value.split('-').map(Number)
    return formatter.format(new Date(Date.UTC(year, month - 1, 1)))
  }
  return `${format(entry.startDate)} – ${entry.endDate ? format(entry.endDate) : 'Present'}`
}

export function safeExperienceLinks(entry: Experience): readonly ExperienceLink[] {
  return (entry.externalLinks ?? []).filter((link) => {
    try { return new URL(link.href).protocol === 'https:' } catch { return false }
  })
}
