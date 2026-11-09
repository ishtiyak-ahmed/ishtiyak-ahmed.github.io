export type ContactLinkId = 'email' | 'linkedin' | 'github' | 'resume'
export type ContactMethodId = ContactLinkId | 'phone'

export interface ContactConfiguration {
  email: string | null
  linkedin: string | null
  github: string | null
  resume: string | null
  phone: { display: string; copyValue: string } | null
}

// Verified destinations migrated from Phase 1. Resume and phone await current details.
export const contactDetails: ContactConfiguration = {
  email: 'ishtiyak.ahmed@mail.utoronto.ca',
  linkedin: 'https://www.linkedin.com/in/ishtiyak-ahmed-598311396/',
  github: 'https://github.com/ishtiyak-ahmed',
  resume: null,
  phone: null,
}

export interface ContactLink {
  id: ContactLinkId
  label: string
  description: string
  href: string | null
  newTab: boolean
  unavailableMessage: string
}

export function getContactLinks(details: ContactConfiguration): ContactLink[] {
  return [
    { id: 'email', label: 'Email', description: details.email ?? 'Email details pending', href: details.email ? `mailto:${details.email}` : null, newTab: false, unavailableMessage: 'Email details pending' },
    { id: 'linkedin', label: 'LinkedIn', description: 'Connect professionally', href: details.linkedin, newTab: true, unavailableMessage: 'Profile details pending' },
    { id: 'github', label: 'GitHub', description: 'Explore what I build', href: details.github, newTab: true, unavailableMessage: 'Profile details pending' },
    { id: 'resume', label: 'Resume', description: 'View my résumé · PDF', href: details.resume, newTab: true, unavailableMessage: 'Current résumé pending' },
  ]
}

export const contactLinks = getContactLinks(contactDetails)
export const contactMethodOrder: readonly ContactMethodId[] = ['email', 'linkedin', 'github', 'resume', 'phone']
export const quickLinkOrder: readonly ContactLinkId[] = ['resume', 'linkedin', 'github', 'email']
export const quickLinks = quickLinkOrder.map((id) => contactLinks.find((link) => link.id === id)!)

export const coffeeContent = {
  heading: "Let's grab a coffee.",
  invitation: "Have an opportunity, an idea, or just want to say hello? I'd love to connect.",
}
