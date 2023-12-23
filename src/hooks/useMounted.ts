import React from "react"

export default function useMounted(callback: () => void) {
  const mounted = React.useRef(false)
  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      callback()
    }
  }, [])
}
