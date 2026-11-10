interface HashBrowser {
  location: { hash: string; pathname: string; search: string }
  history: { pushState(data: unknown, title: string, url: string): void; replaceState(data: unknown, title: string, url: string): void }
}
export function writeHashNavigation(browser: HashBrowser, hash: string, replace = false): boolean {
  if (browser.location.hash === hash) return false
  browser.history[replace ? 'replaceState' : 'pushState'](null, '', `${browser.location.pathname}${browser.location.search}${hash}`)
  return true
}
