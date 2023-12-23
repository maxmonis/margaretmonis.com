import {UserRecord} from "firebase-admin/auth"
import {firestore} from "../admin"

const commentStore = firestore.collectionGroup("comments").firestore

type Comment = {
  id: string
  text: string
  time: number
  user: Pick<UserRecord, "displayName" | "email" | "photoURL" | "uid">
}

export function addComment(
  slug: string,
  comment: Omit<Comment, "id" | "time">,
) {
  return commentStore
    .collection(slug)
    .add({...comment, time: new Date().getTime()})
}

export async function loadComments(slug: string) {
  const {docs} = await commentStore
    .collection(slug)
    .orderBy("time", "desc")
    .get()
  return docs.map(doc => {
    const {
      user: {displayName, photoURL},
      ...comment
    } = {...doc.data(), id: doc.id} as Comment
    return {...comment, user: {displayName, photoURL}}
  })
}
