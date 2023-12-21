import {loadArticleTitle} from "@/datocms/queries"
import {addComment, loadComments} from "@/firebase/admin"
import {sendEmail} from "@/nodemailer/transporter"
import {siteUrl} from "@/shared/constants"
import {getAuth} from "firebase-admin/auth"
import {CommentsApp} from "./CommentsApp"

export function Comments({slug}: {slug: string}) {
  async function saveComment(formData: FormData) {
    "use server"
    const comment = formData.get("comment")?.toString().trim() ?? ""
    const userId = formData.get("userId")?.toString().trim() ?? ""
    if (!comment || !userId) {
      throw Error(`400: Invalid payload ${{comment, userId}}`)
    }
    const [{article}, user]: [
      Awaited<ReturnType<typeof loadArticleTitle>>,
      Awaited<ReturnType<ReturnType<typeof getAuth>["getUser"]>>,
    ] = await Promise.all([loadArticleTitle(slug), getAuth().getUser(userId)])
    if (!article) {
      throw Error(`404: no article found for slug "${slug}"`)
    }
    if (!user) {
      throw Error(`404: no user found for id "${userId}"`)
    }
    const {displayName, email, photoURL, uid} = user
    await addComment(slug, {
      text: comment,
      user: {displayName, email, photoURL, uid},
    })
    try {
      await sendEmail({
        html: `
          <p>${comment}</p>
          <p>${siteUrl}/posts/${slug}</p>
          <p>${email}</p>
          <p>🚨🚨 This is an autogenerated email from an unmonitored mailbox, please do not reply 🚨🚨</p>
        `,
        subject: `${displayName} commented on ${article.title}`,
      })
    } catch (error) {
      console.error(error)
    } finally {
      return loadComments(slug)
    }
  }
  return <CommentsApp {...{saveComment, slug}} />
}
