import { quickLinks } from './contact.ts'

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
  quickLinks,
}
