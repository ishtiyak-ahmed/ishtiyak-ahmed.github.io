import { CodeXml, Coffee, Folder, GraduationCap, House, Terminal } from 'lucide-react'
import type { ApplicationIcon } from '../../data/apps'

const glyphs = {
  house: House, terminal: Terminal, graduation: GraduationCap,
  folder: Folder, code: CodeXml, coffee: Coffee,
}

export function DockIcon({ icon }: { icon: ApplicationIcon }) {
  if (icon.kind === 'asset') {
    return <span className="dock-icon dock-icon--asset"><img src={icon.src} alt="" /></span>
  }

  const Glyph = glyphs[icon.glyph]
  return (
    <span className={`dock-icon dock-icon--${icon.tone}`}>
      <Glyph aria-hidden="true" strokeWidth={1.7} />
    </span>
  )
}
