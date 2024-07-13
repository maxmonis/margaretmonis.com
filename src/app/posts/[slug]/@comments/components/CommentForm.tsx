"use client"
import GoogleButton from "@/components/auth/GoogleButton"
import LogoutButton from "@/components/auth/LogoutButton"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import {useAuth} from "@/context/AuthContext"
import useKeyup from "@/hooks/useKeyup"
import React from "react"

export default function CommentForm({
  saveComment,
}: {
  saveComment: (formData: FormData) => Promise<void>
}) {
  const {authenticating, user} = useAuth()
  const [submitting, setSubmitting] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const reset = () => {
    setSubmitting(false)
    setOpen(false)
  }
  useKeyup("Escape", reset)
  return (
    <>
      {submitting ? (
        <LoadingSpinner text="Saving comment" />
      ) : (
        <button
          className="text-lg uppercase text-orange-700"
          onClick={() => setOpen(true)}
        >
          Add New Comment
        </button>
      )}
      {open && (
        <div
          className={
            submitting
              ? "hidden"
              : "fixed left-0 top-0 flex h-screen w-screen items-center justify-center overflow-hidden"
          }
        >
          <div className="h-full w-full bg-black opacity-50" onClick={reset} />
          <dialog
            className="w-full rounded-lg border border-orange-700 bg-white p-6 opacity-100 max-sm:fixed max-sm:bottom-0 max-sm:rounded-b-none max-sm:pb-10 sm:max-w-lg"
            open
          >
            {authenticating ? (
              <LoadingSpinner text="Authenticating" />
            ) : user ? (
              <form
                action={formData => {
                  const comment = formData.get("comment")?.toString().trim()
                  if (comment) {
                    formData.set("userId", user.uid)
                    saveComment(formData).finally(reset)
                  } else reset()
                }}
                className="flex w-full flex-col items-center gap-4"
              >
                <h4 className="text-xl font-bold">Add New Comment</h4>
                <label className="sr-only" htmlFor="comment">
                  New Comment
                </label>
                <textarea
                  autoFocus
                  className="max-h-40 min-h-[5rem] w-full rounded-lg border border-orange-700 p-4"
                  id="comment"
                  maxLength={2000}
                  name="comment"
                  placeholder="Add a comment..."
                />
                <div className="flex items-center gap-6">
                  <button
                    className="text-lg uppercase text-orange-700"
                    onClick={() => setSubmitting(true)}
                    type="submit"
                  >
                    Save Comment
                  </button>
                  <button className="uppercase" onClick={reset} type="button">
                    Discard
                  </button>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <p>Commenting as {user.displayName}</p>
                  <LogoutButton />
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <p>Please log in to add a comment</p>
                <GoogleButton />
              </div>
            )}
          </dialog>
        </div>
      )}
    </>
  )
}
