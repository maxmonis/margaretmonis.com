"use client"
import useMounted from "@/hooks/useMounted"
import {CommentArray} from "@/types"
import React from "react"
import CommentForm from "./CommentForm"
import CommentList from "./CommentList"

export default function CommentApp({
  saveComment,
  slug,
}: {
  saveComment: (formData: FormData) => Promise<CommentArray>
  slug: string
}) {
  const [commentList, setCommentList] = React.useState<CommentArray>([])
  const [loading, setLoading] = React.useState(true)
  useMounted(async () => {
    try {
      const res = await fetch(`/posts/${slug}/comments`)
      const comments = await res.json()
      setCommentList(comments)
    } finally {
      setLoading(false)
    }
  })
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <CommentList {...{commentList, loading}} />
      <CommentForm {...{saveComment, setCommentList}} />
    </div>
  )
}
