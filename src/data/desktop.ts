export type QuickLinkId = 'resume' | 'linkedin' | 'github' | 'email'

export interface QuickLink {
  id: QuickLinkId
  label: string
  href: string | null
}

export interface DesktopPhoto {
  src: string | null
  alt: string
  objectPosition: string
}

export const desktopContent = {
  hero: {
    heading: "I'm Ishtiyak.",
    subtitle: 'Exploring the intersection of data, technology, and the world around us.',
  },
  currently: {
    title: 'Currently',
    focus: 'Exploring data engineering and analytics.',
    location: 'University of Toronto · Toronto, Canada',
  },
  // Set src to an imported asset or a public URL, and describe the actual photo.
  photo: {
    src: null,
    alt: 'Personal photograph placeholder',
    objectPosition: 'center',
  } satisfies DesktopPhoto,
  // Existing destinations come from the previous portfolio. Resume awaits a current file.
  quickLinks: [
    { id: 'resume', label: 'Resume', href: null },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/ishtiyak-ahmed-598311396/' },
    { id: 'github', label: 'GitHub', href: 'https://github.com/ishtiyak-ahmed' },
    { id: 'email', label: 'Email', href: 'mailto:ishtiyak.ahmed@mail.utoronto.ca' },
  ] satisfies QuickLink[],
}
