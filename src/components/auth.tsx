"use client"
import {googleLogin, logOut} from "@/firebase/auth"
import {Roboto} from "next/font/google"
import Image from "next/image"
import React from "react"

export function GoogleButton() {
  const [submitting, setSubmitting] = React.useState(false)
  return (
    <button
      className={`${font.className} flex w-full items-center justify-center rounded border border-slate-700 bg-gray-50 px-4 py-2 text-black enabled:hover:bg-gray-100`}
      disabled={submitting}
      onClick={() => {
        setSubmitting(true)
        googleLogin().finally(() => {
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

export function LogoutButton() {
  const [submitting, setSubmitting] = React.useState(false)
  return (
    <button
      className="underline"
      disabled={submitting}
      onClick={() => {
        setSubmitting(true)
        logOut().finally(() => {
          setSubmitting(false)
        })
      }}
      type="button"
    >
      Log Out
    </button>
  )
}

const font = Roboto({subsets: ["latin"], weight: ["500"]})
