import {UserRecord} from "firebase-admin/auth"
import {firestore} from "../admin"

const commentStore = firestore.collectionGroup("comments").firestore

type Comment = {
  id: string
  text: string
  time: number
  user: Pick<UserRecord, "displayName" | "email" | "photoURL" | "uid">
}

/**
 * Uploads a new comment, adding a timestamp
 */
export function addComment(
  slug: string,
  comment: Omit<Comment, "id" | "time">,
) {
  return commentStore
    .collection(slug)
    .add({...comment, time: new Date().getTime()} satisfies Omit<Comment, "id">)
}

/**
 * Gets the comments for a slug, ordered from newest to oldest
 */
export async function loadComments(slug: string) {
  const {docs} = await commentStore
    .collection(slug)
    .orderBy("time", "desc")
    .get()

  /* comments in the database contain the creator's ID and
  email, but we don't want to expose these to the client */
  return docs.map(doc => {
    const {
      user: {displayName, photoURL},
      ...comment
    } = {...doc.data(), id: doc.id} as Comment

    /* the UI only displays the creator's name and image */
    return {...comment, user: {displayName, photoURL}}
  })
}
