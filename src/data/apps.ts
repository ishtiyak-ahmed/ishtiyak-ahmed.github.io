export type ApplicationId = 'home' | 'jarvis' | 'education' | 'projects' | 'skills' | 'contact'
export type LaunchApplication = (id: ApplicationId) => void

type IconGlyph = 'house' | 'terminal' | 'graduation' | 'folder' | 'code' | 'coffee'
type IconTone = 'silver' | 'terminal' | 'academic' | 'blue' | 'purple' | 'coffee'

export type ApplicationIcon =
  | { kind: 'glyph'; glyph: IconGlyph; tone: IconTone }
  | { kind: 'asset'; src: string }

export interface ApplicationDefinition {
  id: ApplicationId
  name: string
  icon: ApplicationIcon
  // Home focuses the desktop; future window apps have one window per application.
  launch: 'desktop' | 'window'
  singleInstance: boolean
}

export const applications = {
  home: {
    id: 'home', name: 'Home', launch: 'desktop', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'house', tone: 'silver' },
  },
  jarvis: {
    id: 'jarvis', name: 'Beyond the Data', launch: 'window', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'terminal', tone: 'terminal' },
  },
  education: {
    id: 'education', name: 'Education', launch: 'window', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'graduation', tone: 'academic' },
  },
  projects: {
    id: 'projects', name: 'Projects', launch: 'window', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'folder', tone: 'blue' },
  },
  skills: {
    id: 'skills', name: 'Technical Skills', launch: 'window', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'code', tone: 'purple' },
  },
  contact: {
    id: 'contact', name: "Let's Grab a Coffee", launch: 'window', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'coffee', tone: 'coffee' },
  },
} satisfies Record<ApplicationId, ApplicationDefinition>

export const dockOrder: readonly ApplicationId[] = [
  'home', 'jarvis', 'education', 'projects', 'skills', 'contact',
]
