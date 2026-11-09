import { useRef, useState } from 'react'
import { ArrowUpRight, Check, Coffee, Copy, FileText, Mail, Minus, Phone } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '../../components/ui/BrandIcons'
import { coffeeContent, contactDetails, contactLinks } from '../../data/contact'
import { copyPhoneNumber } from './copyPhone'
import type { CopyPhoneResult } from './copyPhone'
import './coffee.css'

const icons = { email: Mail, linkedin: LinkedInIcon, github: GitHubIcon, resume: FileText }
const copyMessages = {
  success: 'Phone number copied.',
  error: 'Could not copy. Select and copy the number above.',
  unavailable: 'Phone details pending.',
}

export function CoffeeApp() {
  const [copyResult, setCopyResult] = useState<CopyPhoneResult | null>(null)
  const [copying, setCopying] = useState(false)
  const copyInProgress = useRef(false)
  const phone = contactDetails.phone

  async function copyPhone() {
    if (copyInProgress.current || !phone) return
    copyInProgress.current = true
    setCopying(true)
    setCopyResult(null)
    const result = await copyPhoneNumber(phone.copyValue, navigator.clipboard)
    setCopyResult(result)
    setCopying(false)
    copyInProgress.current = false
  }

  return (
    <article className="coffee-app" aria-labelledby="coffee-heading">
      <header className="coffee-app__intro">
        <Coffee className="coffee-app__cup" size={50} strokeWidth={1.25} aria-hidden="true" />
        <h2 id="coffee-heading">{coffeeContent.heading}</h2>
        <p>{coffeeContent.invitation}</p>
      </header>
      <ul className="coffee-app__rows" aria-label="Contact methods">
        {contactLinks.map((link) => {
          const Icon = icons[link.id]
          const contents = <>
            <Icon className="contact-row__icon" size={18} strokeWidth={1.6} aria-hidden="true" />
            <span className="contact-row__text"><span className="contact-row__label">{link.label}</span><span className="contact-row__description">{link.href ? link.description : link.unavailableMessage}</span></span>
            {link.href ? <ArrowUpRight className="contact-row__action" size={15} aria-hidden="true" /> : <Minus className="contact-row__action" size={14} aria-hidden="true" />}
          </>
          return (
            <li key={link.id}>
              {link.href ? (
                <a className="contact-row" href={link.href} target={link.newTab ? '_blank' : undefined}
                  rel={link.newTab ? 'noopener noreferrer' : undefined}
                  aria-label={`${link.label}${link.newTab ? ' (opens in a new tab)' : ''}`}>
                  {contents}
                </a>
              ) : (
                <span className="contact-row contact-row--unavailable" role="link" aria-disabled="true" aria-label={`${link.label} — ${link.unavailableMessage}`}>
                  {contents}
                </span>
              )}
            </li>
          )
        })}
        <li>
          <button type="button" className="contact-row" disabled={!phone} aria-busy={copying || undefined}
            aria-label={phone ? `Copy phone number ${phone.display}` : 'Phone — details pending'} onClick={() => { void copyPhone() }}>
            <Phone className="contact-row__icon" size={18} strokeWidth={1.6} aria-hidden="true" />
            <span className="contact-row__text"><span className="contact-row__label">Phone</span><span className="contact-row__description">{phone?.display ?? 'Details pending'}</span></span>
            {!phone && <Minus className="contact-row__action" size={14} aria-hidden="true" />}
            {phone && (copyResult === 'success' ? <Check className="contact-row__action" size={16} aria-hidden="true" /> : <Copy className="contact-row__action" size={16} aria-hidden="true" />)}
          </button>
          {phone && <span className="coffee-app__copy-hint">{copying ? 'Copying…' : 'Copy number to clipboard'}</span>}
        </li>
      </ul>
      {phone && <p className="coffee-app__feedback" role="status" aria-live="polite">{copyResult ? copyMessages[copyResult] : ''}</p>}
    </article>
  )
}
