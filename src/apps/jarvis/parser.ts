export type ParsedCommand = { ok: true; tokens: string[] } | { ok: false; error: string }
export function parseCommand(input: string): ParsedCommand {
  const tokens: string[] = []
  let token = '', quote = '', started = false
  for (const character of input.trim()) {
    if (quote) {
      if (character === quote) quote = ''
      else token += character
    } else if (character === '"' || character === "'") { quote = character; started = true }
    else if (/\s/.test(character)) { if (started) { tokens.push(token); token = ''; started = false } }
    else { token += character; started = true }
  }
  if (quote) return { ok: false, error: 'Unclosed quote. Put multi-word names inside matching double quotes.' }
  if (started) tokens.push(token)
  return { ok: true, tokens }
}
