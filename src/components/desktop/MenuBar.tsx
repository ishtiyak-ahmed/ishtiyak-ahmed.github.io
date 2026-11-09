import { useEffect, useState } from 'react'
import './menu-bar.css'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short', month: 'short', day: 'numeric',
})
const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric', minute: '2-digit', hour12: true,
})

function LocalClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    function scheduleTick() {
      // Align to the next minute rather than rerendering the shell every second.
      timeout = setTimeout(() => {
        setNow(new Date())
        scheduleTick()
      }, 60_000 - Date.now() % 60_000)
    }
    function syncClock() {
      if (document.visibilityState === 'visible') {
        clearTimeout(timeout)
        setNow(new Date())
        scheduleTick()
      }
    }
    scheduleTick()
    document.addEventListener('visibilitychange', syncClock)
    return () => {
      clearTimeout(timeout)
      document.removeEventListener('visibilitychange', syncClock)
    }
  }, [])

  return (
    <time dateTime={now.toISOString()} className="menu-bar__clock">
      {dateFormatter.format(now)} · {timeFormatter.format(now)}
    </time>
  )
}

export function MenuBar({ activeApplicationName }: { activeApplicationName: string }) {
  return (
    <header className="menu-bar" aria-label="Desktop status">
      <div className="menu-bar__identity">
        <span className="menu-bar__name">Ishtiyak OS</span>
        <span className="menu-bar__separator" aria-hidden="true">|</span>
        <span className="menu-bar__active" title={activeApplicationName}>{activeApplicationName}</span>
      </div>
      <LocalClock />
    </header>
  )
}
