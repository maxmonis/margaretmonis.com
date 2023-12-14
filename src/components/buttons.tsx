import {googleLogin, logOut} from "@/firebase/client"
import {Roboto} from "next/font/google"
import Image from "next/image"
import React from "react"

const font = Roboto({subsets: ["latin"], weight: ["500"]})

export function GoogleButton() {
  const [submitting, setSubmitting] = React.useState(false)
  return (
    <button
      className={`${font.className} flex w-full items-center justify-center rounded border border-slate-700 bg-gray-50 px-4 py-2 text-black enabled:hover:bg-gray-100`}
      disabled={submitting}
      onClick={async () => {
        setSubmitting(true)
        try {
          await googleLogin()
        } finally {
          setSubmitting(false)
        }
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
      Continue with Google
    </button>
  )
}

export function LogoutButton() {
  const [submitting, setSubmitting] = React.useState(false)
  return (
    <button
      className="underline"
      disabled={submitting}
      onClick={async () => {
        setSubmitting(true)
        try {
          await logOut()
        } finally {
          setSubmitting(false)
        }
      }}
      type="button"
    >
      Log Out
    </button>
  )
}
