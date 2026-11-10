export type ApplicationId = 'home' | 'jarvis' | 'education' | 'experience' | 'projects' | 'skills' | 'contact'
export type WindowApplicationId = Exclude<ApplicationId, 'home'>
export type LaunchApplication = (id: ApplicationId) => void

type IconGlyph = 'house' | 'terminal' | 'graduation' | 'folder' | 'code' | 'coffee' | 'briefcase'
type IconTone = 'silver' | 'terminal' | 'academic' | 'blue' | 'purple' | 'coffee' | 'slate'

export type ApplicationIcon =
  | { kind: 'glyph'; glyph: IconGlyph; tone: IconTone }
  | { kind: 'asset'; src: string }

export interface WindowDefinition {
  normal: { width: number; height: number | 'content' }
  expanded?: { width: number; height: number }
  placeholder?: { message: string }
}

export interface ApplicationDefinition {
  id: ApplicationId
  name: string
  icon: ApplicationIcon
  // Home reveals the desktop; every window application has one instance.
  launch: 'desktop' | 'window'
  singleInstance: boolean
  window: WindowDefinition | null
}

export const applications = {
  home: {
    window: null,
    id: 'home', name: 'Home', launch: 'desktop', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'house', tone: 'silver' },
  },
  jarvis: {
    window: { normal: { width: 760, height: 500 }, expanded: { width: 1000, height: 700 } },
    id: 'jarvis', name: 'Beyond the Data', launch: 'window', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'terminal', tone: 'terminal' },
  },
  education: {
    window: { normal: { width: 420, height: 'content' } },
    id: 'education', name: 'Education', launch: 'window', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'graduation', tone: 'academic' },
  },
  experience: {
    window: { normal: { width: 720, height: 480 }, expanded: { width: 1000, height: 700 } },
    id: 'experience', name: 'Experience', launch: 'window', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'briefcase', tone: 'slate' },
  },
  projects: {
    window: { normal: { width: 850, height: 560 }, expanded: { width: 1100, height: 740 } },
    id: 'projects', name: 'Projects', launch: 'window', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'folder', tone: 'blue' },
  },
  skills: {
    window: { normal: { width: 700, height: 520 }, expanded: { width: 950, height: 700 } },
    id: 'skills', name: 'Technical Skills', launch: 'window', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'code', tone: 'purple' },
  },
  contact: {
    window: { normal: { width: 440, height: 'content' } },
    id: 'contact', name: "Let's Grab a Coffee", launch: 'window', singleInstance: true,
    icon: { kind: 'glyph', glyph: 'coffee', tone: 'coffee' },
  },
} satisfies Record<ApplicationId, ApplicationDefinition>

export const dockOrder: readonly ApplicationId[] = [
  'home', 'jarvis', 'education', 'experience', 'projects', 'skills', 'contact',
]
