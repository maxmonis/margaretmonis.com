import React from "react"

export function useKeyup(key: string, callback: () => void) {
  React.useEffect(() => {
    window.addEventListener("keyup", handleKeyup)
    return () => {
      window.removeEventListener("keyup", handleKeyup)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function handleKeyup(e: KeyboardEvent) {
    if (e.key === key) {
      callback()
    }
  }
}

export function useOnScreen(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
) {
  const [onScreen, setOnScreen] = React.useState(false)
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  React.useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(([entry]) => {
        setOnScreen(entry.isIntersecting)
      })
    }
    if (ref.current) {
      observerRef.current?.observe(ref.current)
    }
    return () => {
      observerRef.current?.disconnect()
    }
  }, [ref])
  if (onScreen) {
    callback()
  }
}
