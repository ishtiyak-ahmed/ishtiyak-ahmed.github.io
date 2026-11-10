import { useSyncExternalStore } from 'react'
import { writeHashNavigation } from './browserHistory.ts'
// pushState does not emit hashchange. Internal writes notify the same subscribers,
// tagged so the window controller does not echo its own navigation as a new request.
let snapshot = { hash: window.location.hash, source: 'browser' as 'browser' | 'app', revision: 0 }
const listeners = new Set<() => void>()
function notify(source: 'browser' | 'app') {
  snapshot = { hash: window.location.hash, source, revision: snapshot.revision + 1 }
  listeners.forEach((listener) => listener())
}
function browserChange() { if (snapshot.hash !== window.location.hash) notify('browser') }
function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('hashchange', browserChange)
  window.addEventListener('popstate', browserChange)
  return () => { listeners.delete(listener); window.removeEventListener('hashchange', browserChange); window.removeEventListener('popstate', browserChange) }
}
export function navigateHash(hash: string, replace = false) {
  if (writeHashNavigation(window, hash, replace)) notify('app')
}
export function useHashNavigation() { return useSyncExternalStore(subscribe, () => snapshot) }
