import React from "react"

export default function useKeyup(key: string, callback: () => void) {
  const handleKeyup = (e: KeyboardEvent) => e.key === key && callback()
  React.useEffect(() => {
    window.addEventListener("keyup", handleKeyup)
    return () => window.removeEventListener("keyup", handleKeyup)
  }, [])
}
