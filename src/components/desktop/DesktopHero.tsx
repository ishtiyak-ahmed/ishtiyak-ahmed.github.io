interface DesktopHeroProps {
  heading: string
  subtitle: string
}

export function DesktopHero({ heading, subtitle }: DesktopHeroProps) {
  return (
    <header className="desktop-hero">
      <h1 id="desktop-heading">{heading}</h1>
      <p>{subtitle}</p>
    </header>
  )
}
