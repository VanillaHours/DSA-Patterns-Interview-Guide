import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export interface PathSegment {
  id: string
  title: string
  step?: number
}

interface PathContextValue {
  path: PathSegment[]
  setSegment: (id: string, segment: PathSegment | null) => void
}

const PathContext = createContext<PathContextValue | null>(null)

export function PathProvider({ children }: { children: ReactNode }) {
  const [segments, setSegments] = useState<Record<string, PathSegment>>({})

  const setSegment = useCallback((id: string, segment: PathSegment | null) => {
    setSegments((prev) => {
      const next = { ...prev }
      if (segment) next[id] = segment
      else delete next[id]
      return next
    })
  }, [])

  const path = useMemo(
    () =>
      Object.values(segments).sort((a, b) => (a.step ?? 0) - (b.step ?? 0)),
    [segments]
  )

  return (
    <PathContext.Provider value={{ path, setSegment }}>
      {children}
    </PathContext.Provider>
  )
}

export function usePath() {
  const ctx = useContext(PathContext)
  if (!ctx) throw new Error('usePath outside PathProvider')
  return ctx
}
