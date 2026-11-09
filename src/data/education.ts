export interface EducationConfiguration {
  institution: string
  campus: string
  major: string
  minors: string[]
  expectedGraduation: string | null
  logo: { src: string; alt: string } | null
}

export const education: EducationConfiguration = {
  institution: 'University of Toronto',
  campus: 'Mississauga Campus',
  major: 'Applied Statistics',
  minors: ['Computer Science', 'Geospatial Data Science'],
  // Confirmed for the public portfolio in Phase 5.
  expectedGraduation: 'May 2029',
  // Supply an official, verified institutional mark; do not recreate the logo.
  logo: null,
}

export function educationDetails(config: EducationConfiguration) {
  return [
    { label: 'Major', values: [config.major] },
    { label: 'Minors', values: config.minors },
    { label: 'Expected Graduation', values: [config.expectedGraduation || 'To be confirmed'] },
  ]
}
