import { Image } from 'lucide-react'
import type { DesktopPhoto } from '../../../data/desktop'

export function PhotoWidget({ photo }: { photo: DesktopPhoto }) {
  return (
    <figure className="photo-widget widget-surface" aria-label="Personal photograph">
      {photo.src ? (
        <img src={photo.src} alt={photo.alt} style={{ objectPosition: photo.objectPosition }} />
      ) : (
        <div className="photo-widget__placeholder" role="img" aria-label={photo.alt}>
          <Image size={26} strokeWidth={1} aria-hidden="true" />
          <span>A moment, soon.</span>
        </div>
      )}
    </figure>
  )
}
