import {LoginLink, LogoutLink, TextLink} from "@/components/links"
import {siteUrl} from "@/shared/constants"
import {getDateText, getUserProfile} from "@/shared/functions"
import {Subject} from "@/shared/types"
import admin from "firebase-admin"
import Link from "next/link"
import {redirect} from "next/navigation"
const nodemailer = require("nodemailer")

export async function Comments({
  action,
  slug,
  subject,
  title,
}: {
  action?: string
  slug: string
  subject: Subject
  title: string
}) {
  const href = `${siteUrl}/${subject}/${slug}` as const
  const commentsPath = `/${subject}/${slug}#comments` as const
  const addCommentPath = `/${subject}/${slug}?action=add#comments` as const
  const user = await getUserProfile()
  async function saveComment(formData: FormData) {
    "use server"
    const text = formData.get("comment")?.toString().trim()
    if (user && text) {
      await addComment({
        slug,
        subject,
        text,
        user,
      })
      const {email: userEmail, name: userName} = user
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
    }
    redirect(commentsPath)
  }
  const comments = await loadComments({slug, subject})
  return (
    <>
      {comments.length ? (
        <ul className="w-full divide-y divide-orange-700 rounded-lg border border-orange-700 bg-white">
          {comments.map(({date, id, text, user: {name: userName}}) => (
            <li className="flex flex-col gap-2 p-4" key={id}>
              <span>{text}</span>
              <span className="text-right text-sm">
                {userName} - {getDateText(date, "short")}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet...</p>
      )}
      <TextLink href={addCommentPath} text="Add New Comment" variant="filled" />
      {action === "add" && (
        <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center overflow-hidden">
          <Link
            className="h-full w-full cursor-default bg-black opacity-50"
            href={commentsPath}
          />
          <dialog
            className="z-10 w-full gap-4 rounded-lg border border-orange-700 bg-white p-6 opacity-100 max-sm:fixed max-sm:bottom-0 max-sm:rounded-b-none max-sm:pb-20 sm:max-w-lg"
            open
          >
            {user ? (
              <form
                action={saveComment}
                className="flex w-full flex-col items-center gap-4"
              >
                <h4 className="text-xl font-bold">Add New Comment</h4>
                <textarea
                  autoFocus
                  className="max-h-40 min-h-[5rem] w-full rounded-lg border border-orange-700 p-4"
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
                  <TextLink
                    className="uppercase"
                    href={commentsPath}
                    text="Discard"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <p>Commenting as {user.name}</p>
                  <LogoutLink />
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <p>Please log in to add a comment</p>
                <div className="flex items-center gap-6">
                  <LoginLink returnTo={addCommentPath} />
                </div>
              </div>
            )}
          </dialog>
        </div>
      )}
    </>
  )
}

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      projectId: process.env.FIREBASE_PROJECT_ID,
    }),
  })
}

const commentsCollection = admin.firestore().collection("comments")

function addComment(comment: Omit<Comment, "date" | "id">) {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, "0")
  const day = now.getDate().toString().padStart(2, "0")
  return commentsCollection.add({...comment, date: `${year}-${month}-${day}`})
}

async function loadComments({slug, subject}: {slug: string; subject: Subject}) {
  const {docs} = await commentsCollection
    .where("slug", "==", slug)
    .where("subject", "==", subject)
    .get()
  return docs
    .map(doc => ({...doc.data(), id: doc.id}) as Comment)
    .sort(
      (a, b) =>
        Number(b.date.replace(/-/g, "")) - Number(a.date.replace(/-/g, "")),
    )
}

type Comment = {
  date: string
  id: string
  slug: string
  subject: Subject
  text: string
  user: Awaited<ReturnType<typeof getUserProfile>>
}

const transporter = nodemailer.createTransport({
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  service: "gmail",
})
