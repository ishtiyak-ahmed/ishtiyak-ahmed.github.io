export type ReportBlock =
  | { type: 'text'; text: string }
  | { type: 'list'; items: readonly string[] }
  | { type: 'code'; code: string; language?: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
export interface ReportSection { id: string; heading: string; blocks: readonly ReportBlock[] }
export interface ReportContent {
  title?: string
  summary?: string
  sections: readonly ReportSection[]
  technicalMetadata?: readonly { label: string; value: string }[]
}
// The owning Project supplies the stable project ID and title; reports do not copy IDs.
export type ProjectReport =
  | { status: 'unavailable' }
  | { status: 'published-external'; href: string }
  | { status: 'published-internal'; content: ReportContent }

export function safeExternalUrl(href: string): boolean {
  try { const url = new URL(href); return url.protocol === 'https:' && !url.username && !url.password } catch { return false }
}
export function reportBlocks(blocks: readonly ReportBlock[], assets: readonly string[]): ReportBlock[] {
  return blocks.filter((block) => {
    switch (block.type) {
      case 'text': return !!block.text.trim()
      case 'code': return !!block.code.trim()
      case 'list': return block.items.some((item) => !!item.trim())
      case 'image': return !!block.alt.trim() && assets.includes(block.src) && block.src.startsWith('/') && !block.src.startsWith('//')
    }
  }).map((block) => block.type === 'list' ? { ...block, items: block.items.filter((item) => item.trim()) } : block)
}
export function reportSections(content: ReportContent, assets: readonly string[]): ReportSection[] {
  const seen = new Set<string>()
  return content.sections.flatMap((section) => {
    const blocks = reportBlocks(section.blocks, assets)
    if (!/^[a-z][a-z0-9-]*$/.test(section.id) || !section.heading.trim() || !blocks.length || seen.has(section.id)) return []
    seen.add(section.id)
    return [{ ...section, blocks }]
  })
}
export function validReport(report: ProjectReport | undefined, assets: readonly string[]): boolean {
  if (report?.status === 'published-external') return safeExternalUrl(report.href)
  return report?.status === 'published-internal' && reportSections(report.content, assets).length > 0
}
