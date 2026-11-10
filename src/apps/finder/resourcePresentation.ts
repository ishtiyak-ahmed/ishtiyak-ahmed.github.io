import { ChartNoAxesCombined, CodeXml, FileText, Globe } from 'lucide-react'
import type { ProjectResourceType } from '../../data/projects'
export const resourcePresentation: Record<ProjectResourceType, { icon: typeof FileText; label: string }> = {
  report: { icon: FileText, label: 'Project Report' }, 'case-study': { icon: Globe, label: 'Project Report' },
  source: { icon: CodeXml, label: 'Source Code' }, demo: { icon: Globe, label: 'Live Demo' },
  dashboard: { icon: ChartNoAxesCombined, label: 'Dashboard' }, documentation: { icon: FileText, label: 'Documentation' },
}
