import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'

export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return fallback
  return children
}

/** Static stand-in used during SSR and whenever motion is turned down. */
function StaticFloor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-[#121316]"
      style={{
        backgroundImage:
          'radial-gradient(70% 50% at 50% 34%, oklch(0.79 0.163 62 / 0.1), transparent 68%)',
      }}
    />
  )
}

function MountedGraph() {
  const Graph = useMemo(() => lazy(() => import('./PipelineGraph')), [])
  return (
    <Suspense fallback={<StaticFloor />}>
      <Graph />
    </Suspense>
  )
}

export function SceneLayer({ reduced }: { reduced: boolean }) {
  if (reduced) return <StaticFloor />

  return (
    <ClientOnly fallback={<StaticFloor />}>
      <MountedGraph />
    </ClientOnly>
  )
}
