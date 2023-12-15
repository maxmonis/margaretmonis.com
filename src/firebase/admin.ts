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

export function addComment(comment: Omit<Comment, "date" | "id" | "time">) {
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const time = date.getTime()
  return comments.add({...comment, date: `${year}-${month}-${day}`, time})
}

export async function loadComments({slug}: {slug: string}) {
  const {docs} = await comments.where("slug", "==", slug).get()
  return docs
    .map(doc => ({...doc.data(), id: doc.id}) as Comment)
    .sort((a, b) => b.time - a.time)
}

type Comment = {
  date: string
  id: string
  slug: string
  subject: Subject
  text: string
  time: number
  user: Pick<UserRecord, "displayName" | "email" | "photoURL" | "uid">
}
