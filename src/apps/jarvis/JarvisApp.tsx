import { useEffect, useLayoutEffect, useReducer, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useWindowManager } from '../../hooks/useWindowManager'
import { executeCommand, PROMPT } from './commands'
import { completeCommand, initialTerminalState, INPUT_LIMIT, terminalReducer } from './terminalState'
import './jarvis.css'

export function JarvisApp() {
  const [state, dispatch] = useReducer(terminalReducer, undefined, initialTerminalState)
  const { openApp, activeAppId } = useWindowManager()
  const reduceMotion = useReducedMotion()
  const transcript = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const followOutput = useRef(true)
  const booting = state.bootIndex < state.bootLength

  useEffect(() => {
    if (!booting) return
    if (reduceMotion) { dispatch({ type: 'skip-boot' }); return }
    const timer = window.setInterval(() => dispatch({ type: 'boot-tick' }), 120)
    return () => window.clearInterval(timer)
  }, [booting, reduceMotion])
  useEffect(() => { if (!booting && activeAppId === 'jarvis') input.current?.focus({ preventScroll: true }) }, [booting, activeAppId])
  useLayoutEffect(() => {
    const node = transcript.current
    if (node && followOutput.current) node.scrollTop = node.scrollHeight
  }, [state.entries, state.bootIndex])

  function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (booting || !state.input.trim()) return
    const result = executeCommand(state.input)
    dispatch({ type: 'submit', command: state.input, result })
    if (result.clear) followOutput.current = true
    if (result.effect?.type === 'app') openApp(result.effect.appId, result.effect.resourceId)
    else if (result.effect?.type === 'link') window.open(result.effect.href, '_blank', 'noopener,noreferrer')
  }
  return <section className="jarvis-app" aria-label="JARVIS terminal">
    <div className="jarvis-toolbar"><span>JARVIS</span>{booting ? <button type="button" onClick={() => dispatch({ type: 'skip-boot' })}>Skip initialization</button> : <span>Portfolio command interpreter</span>}</div>
    <div className="jarvis-transcript" ref={transcript} role="log" aria-label="Terminal transcript" aria-live="polite" aria-relevant="additions" tabIndex={0}
      onScroll={() => { const node = transcript.current; if (node) followOutput.current = node.scrollHeight - node.scrollTop - node.clientHeight < 48 }}>
      {state.entries.map((entry) => <div className="jarvis-entry" key={entry.id}>
        {entry.command && <p className="jarvis-command">{PROMPT} {entry.command}</p>}
        {(entry.boot ? entry.lines.slice(0, state.bootIndex) : entry.lines).map((line, index) => <p key={index} data-tone={line.tone}>{line.href ? <a href={line.href} aria-label={line.href.startsWith('mailto:') ? line.text : `${line.text} (opens in a new tab)`} target={line.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">{line.text}</a> : line.text}</p>)}
      </div>)}
    </div>
    <form className="jarvis-prompt" onSubmit={submit}>
      <label htmlFor="jarvis-command">{PROMPT}</label>
      <input id="jarvis-command" ref={input} aria-label="Terminal command" aria-describedby="jarvis-input-help" value={state.input} maxLength={INPUT_LIMIT} disabled={booting} autoComplete="off" autoCapitalize="off" spellCheck={false}
        onChange={(event) => dispatch({ type: 'input', value: event.target.value })}
        onKeyDown={(event) => {
          if (event.ctrlKey || event.metaKey || event.altKey || event.nativeEvent.isComposing) return
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); dispatch({ type: event.key === 'ArrowUp' ? 'older' : 'newer' }) }
          if (event.key === 'Tab' && !event.shiftKey) {
            event.preventDefault()
            const completed = completeCommand(state.input)
            if (completed.input !== state.input) dispatch({ type: 'input', value: completed.input })
            else dispatch({ type: 'suggest', candidates: completed.candidates.length ? completed.candidates : ['No matching commands or identifiers'] })
          }
        }} />
      <span id="jarvis-input-help" className="sr-only">Enter submits. Up and Down browse command history. Tab completes or lists matches. Shift Tab leaves the command field.</span>
    </form>
  </section>
}
