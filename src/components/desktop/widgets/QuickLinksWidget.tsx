import { FileText, Mail } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '../../ui/BrandIcons'
import type { ContactLink } from '../../../data/contact'

const icons = { resume: FileText, linkedin: LinkedInIcon, github: GitHubIcon, email: Mail }

export function QuickLinksWidget({ links }: { links: ContactLink[] }) {
  return (
    <nav className="quick-links widget-surface" aria-label="Quick links">
      <ul>
        {links.map(({ id, label, href }) => {
          const Icon = icons[id]
          const tooltipId = `quick-link-${id}`
          return (
            <li key={id} className="quick-links__item">
              {href ? (
                <a href={href} aria-label={label} aria-describedby={tooltipId}>
                  <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                </a>
              ) : (
                <span className="quick-links__unavailable" role="link" aria-disabled="true" aria-label={`${label} — not yet available`}>
                  <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                </span>
              )}
              <span className="quick-links__tooltip" id={tooltipId} role="tooltip">
                {href ? label : `${label} — coming soon`}
              </span>
              {!href && <span className="quick-links__disabled-mark" aria-hidden="true" />}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
