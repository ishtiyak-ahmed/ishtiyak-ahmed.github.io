import { applications, dockOrder } from '../../data/apps.ts'
import type { ApplicationId } from '../../data/apps.ts'
import { contactDetails } from '../../data/contact.ts'
import type { ContactConfiguration } from '../../data/contact.ts'
import { desktopContent } from '../../data/desktop.ts'
import { education } from '../../data/education.ts'
import { experiences, formatExperienceDates } from '../../data/experience.ts'
import { projects, isReportPublished, resolveProjectLocation } from '../../data/projects.ts'
import { safeExternalUrl } from '../../data/reportModel.ts'
import { skills, skillCategories } from '../../data/skills.ts'
import { OS_VERSION } from '../../data/system.ts'
import { parseCommand } from './parser.ts'

export const PROMPT = 'jarvis@ishtiyak-os:~$'
export interface TerminalLine { text: string; tone?: 'info' | 'success' | 'error'; href?: string }
export type CommandEffect = { type: 'app'; appId: ApplicationId; resourceId?: string } | { type: 'link'; href: string }
export interface CommandResult { lines: TerminalLine[]; effect?: CommandEffect; clear?: boolean }
export const commandRegistry = [
  { name: 'help', usage: 'help', description: 'Supported commands and examples' },
  { name: 'status', usage: 'status', description: 'OS version and configured application/project status' },
  { name: 'whoami', usage: 'whoami', description: 'Verified personal and academic information' },
  { name: 'about', usage: 'about', description: 'Portfolio introduction' },
  { name: 'ls', usage: 'ls [projects|experience|skills]', description: 'Browse configured portfolio directories' },
  { name: 'open', usage: 'open -a <application> | open project <id-or-slug> | open resume|github|linkedin', description: 'Open an OS app, project folder, or verified resource' },
  { name: 'contact', usage: 'contact', description: 'Available contact methods' },
  { name: 'cat', usage: 'cat resume', description: 'How to open the PDF résumé' },
  { name: 'interests', usage: 'interests', description: 'Approved interests, when available' },
  { name: 'clear', usage: 'clear', description: 'Clear output without restarting the session' },
] as const
export const commandAliases: Record<string, string> = { '?': 'help', cls: 'clear' }
export function resolveApplication(name: string): ApplicationId | undefined {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, ' ')
  return dockOrder.find((id) => id === normalized || applications[id].name.toLowerCase() === normalized)
}
const text = (...lines: string[]): CommandResult => ({ lines: lines.map((line) => ({ text: line })) })
const error = (message: string): CommandResult => ({ lines: [{ text: message, tone: 'error' }] })
export function availableTerminalLink(kind: string, contacts: ContactConfiguration): string | undefined {
  if (kind === 'resume') return contacts.resume?.startsWith('/') && !contacts.resume.startsWith('//') && !/[?#]/.test(contacts.resume) ? contacts.resume : undefined
  const value = kind === 'github' ? contacts.github : kind === 'linkedin' ? contacts.linkedin : null
  return value && safeExternalUrl(value) ? value : undefined
}
export function executeCommand(input: string, contacts: ContactConfiguration = contactDetails): CommandResult {
  const parsed = parseCommand(input)
  if (!parsed.ok) return error(parsed.error)
  const [raw, ...args] = parsed.tokens
  if (!raw) return { lines: [] }
  const command = commandAliases[raw.toLowerCase()] ?? raw.toLowerCase()
  const definition = commandRegistry.find((item) => item.name === command)
  if (!definition) return error(`Unknown command: ${raw}. Type help for supported commands.`)
  if (args.some((arg) => arg.startsWith('-')) && !(command === 'open' && args[0] === '-a' && args.length === 2 && !args[1].startsWith('-'))) return error(`Unsupported option. Usage: ${definition.usage}`)
  if (!['ls', 'open', 'cat'].includes(command) && args.length) return error(`Usage: ${definition.usage}`)
  switch (command) {
    case 'help': return text(...commandRegistry.map((item) => `${item.usage}\n  ${item.description}`), 'Examples:', 'open -a education', 'open -a "Beyond the Data"', `open -a "${applications.contact.name}"`, `open project ${projects[0].slug}`, 'Aliases: ? → help, cls → clear. Use Tab for completion; ↑/↓ for command history.')
    case 'status': return text(`Ishtiyak OS ${OS_VERSION} · functional beta`, `${dockOrder.length} applications registered; ${dockOrder.filter((id) => applications[id].launch === 'window').length} window applications implemented.`, `${projects.length} configured projects; ${projects.filter((project) => isReportPublished(project)).length} published report destination(s).`, 'Local deterministic command interpreter. No network service or AI backend.')
    case 'whoami': return text(desktopContent.hero.heading, `${education.institution} · ${education.campus}`, `Major: ${education.major}`, `Minors: ${education.minors.join(', ')}`, `Expected graduation: ${education.expectedGraduation ?? 'Not configured'}`)
    case 'about': return text(desktopContent.hero.heading, desktopContent.hero.subtitle)
    case 'interests': return text('Interests are not available yet.')
    case 'contact': return { lines: [
      ...(contacts.email ? [{ text: `Email: ${contacts.email}`, href: `mailto:${contacts.email}` }] : []),
      ...(['github', 'linkedin'] as const).flatMap((kind) => { const href = availableTerminalLink(kind, contacts); return href ? [{ text: `${kind}: ${href}`, href }] : [] }),
      ...(contacts.phone ? [{ text: `Phone: ${contacts.phone.display}` }] : []),
      ...(!contacts.email && !contacts.github && !contacts.linkedin && !contacts.phone ? [{ text: 'Contact methods are not configured.' }] : []),
    ] }
    case 'clear': return { lines: [], clear: true }
    case 'ls': {
      if (!args.length) return text('Portfolio directories: projects/  experience/  skills/', 'Use ls projects, ls experience, or ls skills. These are configured portfolio collections, not a system filesystem.')
      if (args.length !== 1) return error(`Usage: ${definition.usage}`)
      const directory = args[0].toLowerCase().replace(/\/$/, '')
      if (directory === 'projects') return text(...projects.map((project) => `${project.id} — ${project.title}`))
      if (directory === 'experience') return text(...experiences.map((entry) => `${entry.role} · ${entry.employer}\n  ${formatExperienceDates(entry)} · ${entry.location}`))
      if (directory === 'skills') return text(...skillCategories.map((category) => `${category.name}: ${skills.filter((skill) => skill.category === category.id).map((skill) => skill.name).join(', ')}`))
      return error('Unknown portfolio directory. Choose projects, experience, or skills.')
    }
    case 'cat': return args.length === 1 && args[0].toLowerCase() === 'resume' ? text(availableTerminalLink('resume', contacts) ? 'The résumé is a PDF. Use open resume to view the original document in a new tab.' : 'The résumé PDF is not available.') : error(`Usage: ${definition.usage}`)
    case 'open': {
      if (args[0] === '-a' && args.length === 2) {
        const appId = resolveApplication(args[1])
        return appId ? { lines: [{ text: `Opening ${applications[appId].name}.`, tone: 'success' }], effect: { type: 'app', appId } } : error('Unknown application. Use an application ID or its quoted dock name.')
      }
      if (args[0]?.toLowerCase() === 'project' && args.length === 2) {
        const id = resolveProjectLocation(args[1])
        return id ? { lines: [{ text: `Opening ${projects.find((project) => project.id === id)!.title} in Projects.`, tone: 'success' }], effect: { type: 'app', appId: 'projects', resourceId: id } } : error('Unknown project. Use ls projects for available identifiers.')
      }
      if (args.length === 1 && ['resume', 'github', 'linkedin'].includes(args[0].toLowerCase())) {
        const kind = args[0].toLowerCase(), href = availableTerminalLink(kind, contacts)
        return href ? { lines: [{ text: `Open ${kind} (new tab). If your browser blocks the popup, use this link.`, tone: 'success', href }], effect: { type: 'link', href } } : error(`${kind} is not available in the portfolio configuration.`)
      }
      return error(`Usage: ${definition.usage}`)
    }
  }
  return error('Command unavailable.')
}

export function bootLines(): TerminalLine[] {
  // These local reads are the operations announced by the initialization output.
  const profileReady = !!education.institution && !!desktopContent.hero.heading
  return [
    `Ishtiyak OS [Version ${OS_VERSION}]`, 'Initializing terminal environment...',
    'guest@ishtiyak-os:~$ ./jarvis --initialize', 'JARVIS', 'Just Another Resume Verification & Info System',
    `[ ${profileReady ? 'OK' : 'INFO'} ] Loading portfolio profile`,
    `[ OK ] Indexing ${projects.length} available projects`,
    `[ OK ] Registering ${dockOrder.length} application shortcuts`,
    `[ OK ] Initializing ${commandRegistry.length} command definitions`,
    "System ready. Type 'help' to get started.",
  ].map((line) => ({ text: line, tone: 'info' }))
}
