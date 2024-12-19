import {siteUrl} from "@/constants"
import {addComment} from "@/firebase/comments"
import sendEmail from "@/nodemailer/sendEmail"
import {Article} from "@/types"
import {getAuth} from "firebase-admin/auth"
import {revalidatePath} from "next/cache"
import React from "react"
import CommentForm from "./CommentForm"
import CommentList from "./CommentList"

export default async function CommentApp({
  article: {slug, title},
}: {
  article: Omit<Article, "blurb">
}) {
  async function saveComment(formData: FormData) {
    "use server"
    const comment = formData.get("comment")?.toString().trim() ?? ""
    const userId = formData.get("userId")?.toString().trim() ?? ""
    if (!comment || !userId) {
      throw Error(`400: Invalid payload ${JSON.stringify({comment, userId})}`)
    }
    /* getUser throws an error if there's no match for the user ID */
    const {displayName, email, photoURL, uid} = await getAuth().getUser(userId)
    await addComment(slug, {
      text: comment,
      user: {displayName, email, photoURL, uid},
    })
    revalidatePath(`/posts/${slug}`)
    /* we need to await the call to send the email, but it
    doesn't matter if it resolves or rejects since we've already
    added the new comment and need to show the updated list */
    try {
      await sendEmail({
        html: `
          <p>${comment}</p>
          <p>${siteUrl}/posts/${slug}</p>
          <p>${email}</p>
          <p>🚨🚨 This is an autogenerated email from an unmonitored mailbox, please do not reply 🚨🚨</p>
        `,
        subject: `${displayName} commented on ${title}`,
      })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="w-full">
      <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
        Comments
      </h3>
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
        <React.Suspense>
          <CommentList {...{slug}} />
        </React.Suspense>
        <CommentForm {...{saveComment}} />
      </div>
    </div>
  )
}