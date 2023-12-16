"use client"
import {loadComments} from "@/firebase/admin"
import {getDateText} from "@/shared/functions"
import {ServerAction} from "@/shared/types"
import Image from "next/image"
import React from "react"
import {CommentForm} from "./CommentForm"

export function CommentList({
  saveComment,
  slug,
}: {
  saveComment: ServerAction
  slug: string
}) {
  const [loading, setLoading] = React.useState(true)
  const [commentList, setCommentList] = React.useState<
    Awaited<ReturnType<typeof loadComments>>
  >([])
  const mounted = React.useRef(false)
  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      fetchComments()
    }
  }, [])
  return (
    <>
      {commentList.length === 0 ? (
        <p>{loading ? "Loading comments..." : "No comments yet"}</p>
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
      <CommentForm {...{fetchComments, saveComment, slug}} />
    </>
  )
  async function fetchComments() {
    setLoading(true)
    try {
      const res = await fetch(`/posts/${slug}/comments`)
      const comments = await res.json()
      setCommentList(comments)
    } finally {
      setLoading(false)
    }
  }
}
