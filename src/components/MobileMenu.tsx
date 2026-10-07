'use client'

import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

// A native disclosure (keyboard and screen-reader friendly) that closes after navigating, since
// the header persists across client-side route changes.
export function MobileMenu({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (ref.current) ref.current.open = false
  }, [pathname])

  return (
    <details ref={ref} className="site-menu">
      <summary aria-label="Menu">
        <Menu aria-hidden="true" />
      </summary>
      <nav aria-label="Main (mobile)">
        <ul>{children}</ul>
      </nav>
    </details>
  )
}
