import { useEffect, useRef, useState } from 'react'
import { projectAssetPaths, projectHash, projectResources, resolveReportDestination } from '../data/projects'
import type { Project } from '../data/projects'
import { reportSections } from '../data/reportModel'
import type { ReportBlock } from '../data/reportModel'
import './reports.css'

function ReportImage({ block }: { block: Extract<ReportBlock, { type: 'image' }> }) {
  const [failed, setFailed] = useState(false)
  return failed ? <p>Image unavailable: {block.alt}</p> : <figure><img src={block.src} alt={block.alt} onError={() => setFailed(true)} />{block.caption && <figcaption>{block.caption}</figcaption>}</figure>
}
export function ProjectReportPage({ project, assets = projectAssetPaths }: { project?: Project; assets?: readonly string[] }) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    heading.current?.focus()
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = project ? `${project.title} — Ishtiyak OS` : 'Page not found — Ishtiyak OS'
    return () => { document.title = previous }
  }, [project])
  const report = project?.report
  const sections = report?.status === 'published-internal' ? reportSections(report.content, assets) : []
  const destination = project && resolveReportDestination(project)
  const metadata = report?.status === 'published-internal' ? report.content.technicalMetadata?.filter((item) => item.label.trim() && item.value.trim()) : []
  return <main className="report-page">
    <a href={project ? projectHash(project.id, [project]) : '#/'}>{project ? 'Return to project in Ishtiyak OS' : 'Return to Ishtiyak OS'}</a>
    <article>
      <header><h1 ref={heading} tabIndex={-1}>{project ? report?.status === 'published-internal' && sections.length ? report.content.title || project.title : project.title : 'Page not found'}</h1>
        {!project ? <p>This project or report address is not recognized.</p> : report?.status === 'published-external' && destination ? <><p>This project report is published on its existing website.</p><a href={destination.href} target="_blank" rel="noopener noreferrer">Open {project.title} report (opens in a new tab)</a></> : !sections.length ? <p>A project report has not been published yet.</p> : report?.status === 'published-internal' && report.content.summary && <p>{report.content.summary}</p>}
      </header>
      {!!metadata?.length && <dl>{metadata.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>}
      {sections.length > 1 && <nav aria-label="Report sections">{sections.map((section) => <button type="button" key={section.id} onClick={() => { const target = document.getElementById(`report-${section.id}`); target?.scrollIntoView({ block: 'start' }); target?.focus({ preventScroll: true }) }}>{section.heading}</button>)}</nav>}
      {sections.map((section) => <section key={section.id} aria-labelledby={`report-${section.id}`}><h2 id={`report-${section.id}`} tabIndex={-1}>{section.heading}</h2>{section.blocks.map((block, index) => {
        switch (block.type) {
          case 'text': return <p key={index}>{block.text}</p>
          case 'list': return <ul key={index}>{block.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
          case 'code': return <pre key={index} aria-label={block.language ? `${block.language} code excerpt` : 'Code excerpt'}><code>{block.code}</code></pre>
          case 'image': return <ReportImage key={`${index}:${block.src}`} block={block} />
        }
      })}</section>)}
      {project && sections.length > 0 && projectResources(project).filter((resource) => resource.type !== 'report').length > 0 && <section aria-label="Project resources"><h2>Resources</h2><ul>{projectResources(project).filter((resource) => resource.type !== 'report').map((resource) => <li key={resource.id}><a href={resource.href} target="_blank" rel="noopener noreferrer">{resource.title} (opens in a new tab)</a></li>)}</ul></section>}
    </article>
  </main>
}
