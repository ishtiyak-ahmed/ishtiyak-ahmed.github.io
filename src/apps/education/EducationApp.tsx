import { GraduationCap } from 'lucide-react'
import { education, educationDetails } from '../../data/education'
import './education.css'

export function EducationApp() {
  return (
    <article className="education-app" aria-labelledby="institution-heading">
      <header className="education-app__identity">
        {education.logo ? (
          <img className="education-app__logo" src={education.logo.src} alt={education.logo.alt} />
        ) : (
          <div className="education-app__logo-placeholder" role="img" aria-label="University logo pending; temporary academic icon">
            <GraduationCap size={34} strokeWidth={1.3} aria-hidden="true" />
          </div>
        )}
        <h2 id="institution-heading">{education.institution}</h2>
        <p>{education.campus}</p>
      </header>
      <dl className="education-app__details">
        {educationDetails(education).map(({ label, values }) => (
          <div className="education-app__row" key={label}>
            <dt>{label}</dt>
            <dd>{values.map((value) => <span key={value}>{value}</span>)}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
