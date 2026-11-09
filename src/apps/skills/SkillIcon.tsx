import { BarChart3, Braces, Database, DatabaseZap, GitBranch, Network, ScatterChart, ShieldCheck, Sigma, TestTubeDiagonal } from 'lucide-react'
import type { SkillIcon as SkillIconConfiguration } from '../../data/skills'

const assets = import.meta.glob<string>('../../assets/icons/skills/*.svg', { eager: true, query: '?url', import: 'default' })
const symbols = { database: Database, chart: BarChart3, formula: Sigma, query: DatabaseZap, scatter: ScatterChart, pipeline: GitBranch, model: Network, validation: ShieldCheck, testing: TestTubeDiagonal }

export function SkillIcon({ icon }: { icon: SkillIconConfiguration }) {
  if (icon.kind === 'brand') {
    const src = assets[`../../assets/icons/skills/${icon.asset}.svg`]
    if (src) return <img src={src} alt="" className={icon.monochrome ? 'skill-icon skill-icon--monochrome' : 'skill-icon'} />
    return <Braces className="skill-icon" aria-hidden="true" />
  }
  const Symbol = symbols[icon.symbol]
  return <Symbol className="skill-icon" style={{ color: icon.color }} strokeWidth={1.5} aria-hidden="true" />
}
