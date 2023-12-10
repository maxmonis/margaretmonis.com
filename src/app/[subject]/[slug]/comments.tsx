import {LoginLink, LogoutLink, SignupLink, TextLink} from "@/components/links"
import {getDateText, getUserProfile} from "@/shared/functions"
import {Subject} from "@/shared/types"
import admin from "firebase-admin"
import Link from "next/link"
import {redirect} from "next/navigation"

export async function Comments({
  action,
  slug,
  subject,
}: {
  action?: string
  slug: string
  subject: Subject
}) {
  const commentsPath = `/${subject}/${slug}#comments` as const
  const addCommentPath = `/${subject}/${slug}?action=add#comments` as const
  const user = await getUserProfile()
  async function saveComment(formData: FormData) {
    "use server"
    const text = formData.get("text")
    if (typeof text !== "string") throw Error("Text is required")
    if (!user) throw Error("Must be logged in to comment")
    await addComment({
      slug,
      subject,
      text,
      userId: user?.sid,
      userName: user?.name,
    })
    redirect(commentsPath)
  }
  const comments = await loadComments({slug, subject})
  return (
    <div
      className="flex w-full flex-col items-center gap-6 pt-20"
      id="comments"
    >
      <h3 className="text-center text-xl font-bold sm:text-2xl">Comments</h3>
      {comments.length ? (
        <ul className="w-full divide-y divide-orange-700 rounded-lg border border-orange-700 bg-white">
          {comments.map(({date, id, text, userName}) => (
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
            className="z-10 flex flex-col items-center justify-center gap-4 rounded-lg border border-orange-700 bg-white p-6 opacity-100"
            open
          >
            {user ? (
              <form
                action={saveComment}
                className="flex w-full flex-col items-center gap-4"
              >
                <h4 className="text-lg font-bold">Add New Comment</h4>
                <textarea
                  autoFocus
                  className="w-full rounded-lg border border-orange-700 p-4"
                  maxLength={2000}
                  name="text"
                  placeholder="Add a comment..."
                  required
                />
                <button
                  className="text-lg uppercase text-orange-700"
                  type="submit"
                >
                  Save Comment
                </button>
                <div className="flex">
                  <p className="mr-2">Commenting as {user.name}</p>
                  <LogoutLink />
                </div>
              </form>
            ) : (
              <>
                <p>Please log in to add a comment</p>
                <div className="flex items-center gap-6">
                  <LoginLink returnTo={addCommentPath} />
                  <SignupLink returnTo={addCommentPath} />
                </div>
              </>
            )}
          </dialog>
        </div>
      )}
    </div>
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
  userId: string
  userName: string
}