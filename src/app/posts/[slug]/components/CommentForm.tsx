"use client"

import {TextLink} from "@/components/links"
import {useKeyup} from "@/shared/hooks"
import {UserProfile} from "@auth0/nextjs-auth0/client"
import React from "react"

export function CommentForm({
  saveComment,
  slug,
  user,
}: {
  saveComment: (formData: FormData) => Promise<void>
  slug: string
  user: UserProfile | null
}) {
  const [open, setOpen] = React.useState(false)
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
        <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center overflow-hidden">
          <div
            className="h-full w-full cursor-default bg-black opacity-50"
            onClick={() => setOpen(false)}
          />
          <dialog
            className="w-full rounded-lg border border-orange-700 bg-white p-6 opacity-100 max-sm:fixed max-sm:bottom-0 max-sm:rounded-b-none max-sm:pb-10 sm:max-w-lg"
            open
          >
            {user ? (
              <form
                action={e => {
                  setOpen(false)
                  saveComment(e)
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
                  <p>Commenting as {user.name}</p>
                  <TextLink
                    className="underline"
                    href="/api/auth/logout"
                    onClick={() => setOpen(false)}
                    text="Log Out"
                  />
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <p>Please log in to add a comment</p>
                <div className="flex items-center gap-6">
                  <TextLink
                    href={`/api/auth/login?returnTo=${encodeURIComponent(
                      `/posts/${slug}#comments`,
                    )}`}
                    onClick={() => setOpen(false)}
                    text="Log In"
                    variant="filled"
                  />
                </div>
              </div>
            )}
          </dialog>
        </div>
      )}
    </>
  )
}
