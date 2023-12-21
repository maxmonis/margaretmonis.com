import React from "react"

export function useKeyup(key: string, callback: () => void) {
  const handleKeyup = (e: KeyboardEvent) => e.key === key && callback()
  React.useEffect(() => {
    window.addEventListener("keyup", handleKeyup)
    return () => window.removeEventListener("keyup", handleKeyup)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
