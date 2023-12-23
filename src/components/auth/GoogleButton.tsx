import {auth} from "@/firebase"
import {roboto} from "@/styles/fonts"
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import Image from "next/image"
import React from "react"

export function GoogleButton() {
  const [submitting, setSubmitting] = React.useState(false)
  return (
    <button
      className={`${roboto.className} flex items-center justify-center rounded border border-slate-700 bg-gray-50 px-4 py-2 text-black enabled:hover:bg-gray-100`}
      disabled={submitting}
      onClick={() => {
        setSubmitting(true)
        signInWithPopup(auth, new GoogleAuthProvider()).finally(() => {
          setSubmitting(false)
        })
      }}
      type="button"
    >
      <Image
        alt="google logo"
        className="mr-3 w-6"
        height={24}
        src={"/google.svg"}
        width={24}
      />
      Sign in with Google
    </button>
  )
}
