import { useRef, useEffect } from "react"
import { useAutocompleteRoot } from "../Root/RootContext"

export function Sentinel({ className, scrollMargin }: { className?: string; scrollMargin?: string }) {
  const { scrollCallback } = useAutocompleteRoot()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const isCalledRef = useRef(false)
  useEffect(() => {
    if (!sentinelRef.current || !scrollCallback) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isCalledRef.current) {
          isCalledRef.current = true
          scrollCallback().then(() => {
            isCalledRef.current = false
          })
        }
      },
      { rootMargin: scrollMargin ?? "0px 0px" },
    )
    io.observe(sentinelRef.current)
    return () => io.disconnect()
  }, [scrollCallback])
  return <div ref={sentinelRef} className={className} />
}
