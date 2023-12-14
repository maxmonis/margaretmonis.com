import admin from "firebase-admin"
import {UserRecord} from "firebase-admin/auth"
import {Subject} from "../shared/types"

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
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

export async function loadComments({slug}: {slug: string}) {
  const {docs} = await comments.where("slug", "==", slug).get()
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
  user: Pick<UserRecord, "displayName" | "email" | "photoURL" | "uid">
}
