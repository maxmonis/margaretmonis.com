import React from "react"

/**
 * Calls the callback when the component first mounts
 */
export default function useMounted(callback: () => void) {
  const mounted = React.useRef(false)
  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      callback()
    }
  }, [])
}
