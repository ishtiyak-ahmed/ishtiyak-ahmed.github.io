export type SkillCategoryId = 'languages' | 'data' | 'tools' | 'practices'
export type SkillSymbol = 'database' | 'chart' | 'formula' | 'query' | 'scatter' | 'pipeline' | 'model' | 'validation' | 'testing'
export type SkillIcon = { kind: 'brand'; asset: string; monochrome?: boolean } | { kind: 'symbol'; symbol: SkillSymbol; color: string }

export interface RelatedWorkReference {
  applicationId: 'projects' | 'experience'
  resourceId: string
}
export interface Skill {
  id: string
  name: string
  category: SkillCategoryId
  icon: SkillIcon
  description: string
  relatedWork?: readonly RelatedWorkReference[]
}

export const skillCategories: readonly { id: SkillCategoryId; name: string }[] = [
  { id: 'languages', name: 'Programming Languages' },
  { id: 'data', name: 'Data & Analytics' },
  { id: 'tools', name: 'Frameworks & Development Tools' },
  { id: 'practices', name: 'Engineering Practices' },
]

// Conservative descriptions; verified work mappings will follow the content review.
export const skills: readonly Skill[] = [
  { id: 'python', name: 'Python', category: 'languages', icon: { kind: 'brand', asset: 'python' }, description: 'A general-purpose language for data processing, analysis, and scripting.' },
  { id: 'sql', name: 'SQL', category: 'languages', icon: { kind: 'symbol', symbol: 'database', color: '#8bb9df' }, description: 'Query and transform structured data in relational databases.' },
  { id: 'java', name: 'Java', category: 'languages', icon: { kind: 'brand', asset: 'java' }, description: 'Build structured, object-oriented applications with static types.' },
  { id: 'javascript', name: 'JavaScript', category: 'languages', icon: { kind: 'brand', asset: 'javascript' }, description: 'Add interaction and application behavior to the web.' },
  { id: 'typescript', name: 'TypeScript', category: 'languages', icon: { kind: 'brand', asset: 'typescript' }, description: 'Use static types to make JavaScript applications easier to maintain.' },
  { id: 'sqlite', name: 'SQLite', category: 'data', icon: { kind: 'brand', asset: 'sqlite' }, description: 'Store and query relational data in a lightweight local database.' },
  { id: 'power-bi', name: 'Power BI', category: 'data', icon: { kind: 'symbol', symbol: 'chart', color: '#e9c957' }, description: 'Explore data and present findings through reports and dashboards.' },
  { id: 'dax', name: 'DAX', category: 'data', icon: { kind: 'symbol', symbol: 'formula', color: '#dfc271' }, description: 'Define calculations and measures for analytical data models.' },
  { id: 'power-query', name: 'Power Query', category: 'data', icon: { kind: 'symbol', symbol: 'query', color: '#88b89a' }, description: 'Prepare and transform data before analysis.' },
  { id: 'tableau', name: 'Tableau', category: 'data', icon: { kind: 'symbol', symbol: 'scatter', color: '#8baaca' }, description: 'Create visualizations to explore patterns and communicate findings.' },
  { id: 'react', name: 'React', category: 'tools', icon: { kind: 'brand', asset: 'react' }, description: 'Compose interactive user interfaces from reusable components.' },
  { id: 'git', name: 'Git', category: 'tools', icon: { kind: 'brand', asset: 'git' }, description: 'Track code changes and work with branches and version history.' },
  { id: 'github', name: 'GitHub', category: 'tools', icon: { kind: 'brand', asset: 'github', monochrome: true }, description: 'Host repositories and collaborate through issues and code review.' },
  { id: 'vercel', name: 'Vercel', category: 'tools', icon: { kind: 'brand', asset: 'vercel', monochrome: true }, description: 'Deploy and preview web applications.' },
  { id: 'etl-pipelines', name: 'ETL Pipelines', category: 'practices', icon: { kind: 'symbol', symbol: 'pipeline', color: '#99b4c2' }, description: 'Extract, transform, and load data through repeatable processing steps.' },
  { id: 'data-modeling', name: 'Data Modeling', category: 'practices', icon: { kind: 'symbol', symbol: 'model', color: '#b4a2cc' }, description: 'Organize data structures and relationships around analytical needs.' },
  { id: 'data-validation', name: 'Data Validation', category: 'practices', icon: { kind: 'symbol', symbol: 'validation', color: '#9ac2a7' }, description: 'Check data quality, consistency, and expected constraints.' },
  { id: 'automated-testing', name: 'Automated Testing', category: 'practices', icon: { kind: 'symbol', symbol: 'testing', color: '#b3bbd6' }, description: 'Use repeatable checks to verify behavior and catch regressions.' },
]
