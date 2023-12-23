import {auth} from "@/firebase"
import {signOut} from "firebase/auth"
import React from "react"

export default function LogoutButton() {
  const [submitting, setSubmitting] = React.useState(false)
  return (
    <button
      className="underline"
      disabled={submitting}
      onClick={() => {
        setSubmitting(true)
        signOut(auth).finally(() => {
          setSubmitting(false)
        })
      }}
      type="button"
    >
      Log Out
    </button>
  )
}
