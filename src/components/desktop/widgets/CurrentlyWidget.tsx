interface CurrentlyWidgetProps {
  title: string
  focus: string
  location: string
}

export function CurrentlyWidget({ title, focus, location }: CurrentlyWidgetProps) {
  return (
    <section className="currently-widget widget-surface" aria-labelledby="currently-heading">
      <h2 id="currently-heading">{title}</h2>
      <p className="currently-widget__focus">{focus}</p>
      <p className="currently-widget__location">{location}</p>
    </section>
  )
}
