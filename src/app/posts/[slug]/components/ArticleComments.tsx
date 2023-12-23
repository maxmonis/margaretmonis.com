import {siteUrl} from "@/constants"
import {addComment, loadComments} from "@/firebase/comments"
import sendEmail from "@/nodemailer/sendEmail"
import {getAuth} from "firebase-admin/auth"
import CommentApp from "./CommentApp"

export default function ArticleComments({
  slug,
  title,
}: {
  slug: string
  title: string
}) {
  async function saveComment(formData: FormData) {
    "use server"
    const comment = formData.get("comment")?.toString().trim() ?? ""
    const userId = formData.get("userId")?.toString().trim() ?? ""
    if (!comment || !userId) {
      throw Error(`400: Invalid payload ${JSON.stringify({comment, userId})}`)
    }
    const {displayName, email, photoURL, uid} = await getAuth().getUser(userId)
    await addComment(slug, {
      text: comment,
      user: {displayName, email, photoURL, uid},
    })
    const [commentsRes] = await Promise.allSettled([
      loadComments(slug),
      sendEmail({
        html: `
          <p>${comment}</p>
          <p>${siteUrl}/posts/${slug}</p>
          <p>${email}</p>
          <p>🚨🚨 This is an autogenerated email from an unmonitored mailbox, please do not reply 🚨🚨</p>
        `,
        subject: `${displayName} commented on ${title}`,
      }),
    ])
    if (commentsRes.status === "rejected") {
      throw Error("500: unable to load comments")
    }
    return commentsRes.value
  }
  return <CommentApp {...{saveComment, slug}} />
}
