import {getUser} from "@/shared/auth0"
import {siteUrl} from "@/shared/constants"
import {addComment, loadComments} from "@/shared/firebase"
import {getDateText} from "@/shared/functions"
import {Subject} from "@/shared/types"
import {redirect} from "next/navigation"
import {CommentForm} from "./CommentForm"

const nodemailer = require("nodemailer")

export async function CommentsApp({
  slug,
  subject,
  title,
}: {
  slug: string
  subject: Subject
  title: string
}) {
  const route = `${subject}/${slug}` as const
  const commentList = await loadComments({slug, subject})
  const user = await getUser()
  async function saveComment(formData: FormData) {
    "use server"
    const text = formData.get("comment")?.toString().trim()
    if (user && text) {
      try {
        await addComment({slug, subject, text, user})
        const {email: userEmail, name: userName} = user
        const href = `${siteUrl}/${route}` as const
        transporter.sendMail({
          from: process.env.NODEMAILER_EMAIL,
          html: `
            <p>${text}</p>
            <a href=${href}#comments>${href}</a>
            ${userEmail === userName ? "" : `<p>User email: ${userEmail}</p>`}
            <p>🚨🚨 This is an autogenerated email from an unmonitored mailbox, please do not reply 🚨🚨</p>
          `,
          subject: `${userName} commented on ${title}`,
          to:
            process.env.NODE_ENV === "production"
              ? "monismargaret@gmail.com"
              : "mmonis77@gmail.com",
        })
      } finally {
        redirect(`/${route}#comments`)
      }
    }
  }
  return (
    <>
      {commentList.length === 0 ? (
        <p>No comments yet...</p>
      ) : (
        <ul className="w-full divide-y divide-orange-700 rounded-lg border border-orange-700 bg-white">
          {commentList.map(({date, id, text, user: {name: userName}}) => (
            <li className="flex flex-col gap-2 p-4" key={id}>
              <span>{text}</span>
              <span className="text-right text-sm">
                {userName} - {getDateText(date, "short")}
              </span>
            </li>
          ))}
        </ul>
      )}
      <CommentForm {...{saveComment, route, user}} />
    </>
  )
}

const transporter = nodemailer.createTransport({
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  service: "gmail",
})
