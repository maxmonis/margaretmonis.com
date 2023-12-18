"use client"
import {GoogleButton, LogoutButton} from "@/components/auth"
import {useAuth} from "@/context/AuthContext"
import {loadComments} from "@/firebase/admin"
import {getDateText} from "@/shared/functions"
import {useKeyup, useOnScreen} from "@/shared/hooks"
import Image from "next/image"
import React from "react"

export function CommentsApp({
  saveComment,
  slug,
}: {
  saveComment: (formData: FormData) => ReturnType<typeof loadComments>
  slug: string
}) {
  const [loading, setLoading] = React.useState(true)
  const [commentList, setCommentList] = React.useState<
    Awaited<ReturnType<typeof saveComment>>
  >([])
  const mounted = React.useRef(false)
  const elementRef = React.useRef<HTMLDivElement>(null)
  useOnScreen(elementRef, async () => {
    if (loading && !mounted.current) {
      mounted.current = true
      try {
        const res = await fetch(`/posts/${slug}/comments`)
        const comments = await res.json()
        setCommentList(comments)
      } finally {
        setLoading(false)
      }
    }
  })
  const {authenticating, user} = useAuth()
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const reset = () => {
    setSubmitting(false)
    setOpen(false)
  }
  useKeyup("Escape", reset)
  return (
    <div
      className="mx-auto flex w-full max-w-xl flex-col items-center gap-6"
      ref={elementRef}
    >
      {loading ? (
        <LoadingSpinner text="Loading comments" />
      ) : commentList.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        <ul className="w-full divide-y divide-orange-700 rounded-lg border border-orange-700 bg-white">
          {commentList.map(
            ({id, text, time, user: {displayName = "Anonymous", photoURL}}) => (
              <li className="flex flex-col gap-3 p-4" key={id}>
                <span>{text}</span>
                <span className="flex items-center justify-end gap-2 text-right text-sm">
                  {photoURL && (
                    <Image
                      alt={`Profile picture of ${displayName}`}
                      className="h-6 w-6 rounded-full"
                      height={24}
                      src={photoURL}
                      width={24}
                    />
                  )}
                  {displayName} - {getDateText({date: time, month: "short"})}
                </span>
              </li>
            ),
          )}
        </ul>
      )}
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
                  const text = formData.get("comment")?.toString().trim() ?? ""
                  if (text) {
                    formData.set("userId", user.uid)
                    saveComment(formData).then(setCommentList).finally(reset)
                  } else {
                    reset()
                  }
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
                <div className="flex items-center gap-6">
                  <GoogleButton />
                </div>
              </div>
            )}
          </dialog>
        </div>
      )}
    </div>
  )
}

function LoadingSpinner({text}: {text: string}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-busy="true"
        className="h-5 w-5 animate-spin rounded-full border-4 border-blue-950 border-r-transparent"
        role="alert"
      />
      <p className="text-small">{text}</p>
    </div>
  )
}
