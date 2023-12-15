import {addComment, loadComments} from "@/firebase/admin"
import {siteUrl} from "@/shared/constants"
import {getDateText} from "@/shared/functions"
import {Subject} from "@/shared/types"
import {getAuth} from "firebase-admin/auth"
import Image from "next/image"
import {redirect} from "next/navigation"
import {CommentForm} from "./CommentForm"

export async function CommentsApp({
  slug,
  subject,
  title,
}: {
  slug: string
  subject: Subject
  title: string
}) {
  const commentList = await loadComments({slug})
  async function saveComment(formData: FormData) {
    "use server"
    const id = formData.get("userId")?.toString() ?? ""
    const text = formData.get("comment")?.toString().trim() ?? ""
    const user = id && text ? await getAuth().getUser(id) : null
    if (user) {
      const {displayName, email, photoURL, uid} = user
      try {
        await addComment({
          slug,
          subject,
          text,
          user: {displayName, email, photoURL, uid},
        })
        transporter.sendMail({
          from: process.env.NODEMAILER_EMAIL,
          html: `
            <p>${text}</p>
            <p>${siteUrl}/posts/${slug}</p>
            <p>${email}</p>
            <p>🚨🚨 This is an autogenerated email from an unmonitored mailbox, please do not reply 🚨🚨</p>
          `,
          subject: `${displayName} commented on ${title}`,
          to:
            process.env.NODE_ENV === "production"
              ? "monismargaret@gmail.com"
              : "mmonis77@gmail.com",
        })
      } finally {
        redirect(`/posts/${slug}`)
      }
    }
  }
  return (
    <>
      {commentList.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        <ul className="w-full divide-y divide-orange-700 rounded-lg border border-orange-700 bg-white">
          {commentList.map(
            ({date, id, text, user: {displayName = "Anonymous", photoURL}}) => (
              <li className="flex flex-col gap-2 p-4" key={id}>
                <span>{text}</span>
                <span className="flex items-center justify-end gap-2 text-right">
                  {photoURL && (
                    <Image
                      alt={`Profile picture of ${displayName}`}
                      className="h-6 w-6 rounded-full"
                      height={24}
                      src={photoURL}
                      width={24}
                    />
                  )}
                  {displayName} - {getDateText(date, "short")}
                </span>
              </li>
            ),
          )}
        </ul>
      )}
      <CommentForm {...{saveComment}} />
    </>
  )
}

const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  service: "gmail",
})
