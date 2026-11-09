import type { Experience } from '../../src/data/experience.ts'

// Fictional TEST FIXTURES only. Never import from production source modules.
export const experienceFixtures: readonly Experience[] = [
  { id: 'test-role-older', employer: 'TEST FIXTURE Studio', role: 'TEST FIXTURE Earlier Role', startDate: '2024-01', endDate: '2024-05', location: 'Test location' },
  { id: 'test-role-newest', employer: 'TEST FIXTURE Laboratory', role: 'TEST FIXTURE Latest Role', startDate: '2026-06', endDate: '2026-09', location: 'Test location', summary: 'Test summary for verifying detail rendering and selection.', accomplishments: Array.from({ length: 18 }, (_, index) => `Test fixture responsibility ${index + 1}: enough neutral text to exercise internal detail scrolling.`) },
  { id: 'test-role-middle', employer: 'TEST FIXTURE Studio', role: 'TEST FIXTURE Second Role', startDate: '2025-02', endDate: '2025-07', location: 'Test location' },
]

export const longHistoryFixtures: readonly Experience[] = [
  ...experienceFixtures,
  ...Array.from({ length: 20 }, (_, index) => ({
    id: `test-extra-${index}`,
    employer: `TEST FIXTURE Employer ${index + 1}`,
    role: 'TEST FIXTURE Role',
    startDate: '2023-01', endDate: '2023-04', location: 'Test location',
  })),
]
