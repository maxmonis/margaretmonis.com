import {UserProfile} from "@auth0/nextjs-auth0/client"
import admin from "firebase-admin"
import {Subject} from "./types"

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      projectId: process.env.FIREBASE_PROJECT_ID,
    }),
  })
}

const comments = admin.firestore().collection("comments")

export function addComment(comment: Omit<Comment, "date" | "id">) {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, "0")
  const day = now.getDate().toString().padStart(2, "0")
  return comments.add({...comment, date: `${year}-${month}-${day}`})
}

export async function loadComments({
  slug,
  subject,
}: {
  slug: string
  subject: Subject
}) {
  const {docs} = await comments
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
  user: UserProfile
}
