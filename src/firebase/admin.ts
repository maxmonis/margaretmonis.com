import admin from "firebase-admin"
import {UserRecord} from "firebase-admin/auth"

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    }),
  })
}

const comments = admin.firestore().collectionGroup("comments").firestore

export function addComment(
  slug: string,
  comment: Omit<Comment, "id" | "time">,
) {
  return comments.collection(slug).add({...comment, time: new Date().getTime()})
}

export async function loadComments(slug: string) {
  const {docs} = await comments.collection(slug).orderBy("time", "desc").get()
  return docs.map(doc => {
    const {
      user: {displayName, photoURL},
      ...comment
    } = {...doc.data(), id: doc.id} as Comment
    return {...comment, user: {displayName, photoURL}}
  })
}

type Comment = {
  id: string
  text: string
  time: number
  user: Pick<UserRecord, "displayName" | "email" | "photoURL" | "uid">
}
