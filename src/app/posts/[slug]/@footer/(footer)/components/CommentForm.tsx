"use client"
import {GoogleButton, LogoutButton} from "@/components/buttons"
import {useAuth} from "@/context/AuthContext"
import {useKeyup} from "@/shared/hooks"
import React from "react"

export function CommentForm({
  saveComment,
}: {
  saveComment: (formData: FormData) => Promise<void>
}) {
  const {loading, user} = useAuth()
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  useKeyup("Escape", () => setOpen(false))
  return (
    <>
      <button
        className="text-lg uppercase text-orange-700"
        onClick={() => setOpen(true)}
      >
        Add New Comment
      </button>
      {open && (
        <div
          className={
            submitting
              ? "hidden"
              : "fixed left-0 top-0 flex h-screen w-screen items-center justify-center overflow-hidden"
          }
        >
          <div
            className="h-full w-full cursor-default bg-black opacity-50"
            onClick={() => setOpen(false)}
          />
          <dialog
            className="w-full rounded-lg border border-orange-700 bg-white p-6 opacity-100 max-sm:fixed max-sm:bottom-0 max-sm:rounded-b-none max-sm:pb-10 sm:max-w-lg"
            open
          >
            {loading ? (
              <p>Authenticating...</p>
            ) : user ? (
              <form
                action={formData => {
                  formData.set("userId", user.uid)
                  saveComment(formData).finally(() => {
                    setOpen(false)
                    setSubmitting(false)
                  })
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
                  <button
                    className="uppercase"
                    onClick={() => setOpen(false)}
                    type="button"
                  >
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
                <div className="flex items-center gap-6">
                  <GoogleButton />
                </div>
              </div>
            )}
          </dialog>
        </div>
      )}
    </>
  )
}
