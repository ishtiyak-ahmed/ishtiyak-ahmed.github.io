export type CopyPhoneResult = 'success' | 'error' | 'unavailable'
export interface ClipboardWriter { writeText: (value: string) => Promise<void> }

export async function copyPhoneNumber(value: string | null, clipboard?: ClipboardWriter): Promise<CopyPhoneResult> {
  if (!value) return 'unavailable'
  if (!clipboard) return 'error'
  try {
    await clipboard.writeText(value)
    return 'success'
  } catch {
    return 'error'
  }
}
