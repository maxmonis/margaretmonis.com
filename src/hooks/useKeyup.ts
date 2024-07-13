import React from "react"

/**
 * Calls the callback if the user presses the specified key
 */
export default function useKeyup(key: string, callback: () => void) {
  const handleKeyup = (e: KeyboardEvent) => {
    if (e.key === key) callback()
  }
  React.useEffect(() => {
    window.addEventListener("keyup", handleKeyup)
    return () => {
      window.removeEventListener("keyup", handleKeyup)
    }
  }, [])
}
