import { useEffect, useState } from 'react'
import { chapters } from '~/content/site'
import { scrollToSection } from '~/lib/lenis'
import { navBus } from '~/lib/navBus'

/** Station rail: numbered stops along the line rather than anonymous dots. */
export function SectionNav() {
  const [active, setActive] = useState(0)

  useEffect(() => navBus.subscribe(setActive), [])

  return (
    <nav className="station-rail" aria-label="Станции">
      {chapters.map((chapter, i) => (
        <button
          key={chapter.id}
          type="button"
          data-cursor-label={chapter.label}
          className={`station ${active === i ? 'is-active' : ''}`}
          aria-current={active === i ? 'true' : undefined}
          onClick={() => scrollToSection(`#${chapter.id}`)}
        >
          <span className="station-name">{chapter.label}</span>
          <span className="tabular-nums">{chapter.code}</span>
          <span className="station-tick" />
        </button>
      ))}
    </nav>
  )
}
