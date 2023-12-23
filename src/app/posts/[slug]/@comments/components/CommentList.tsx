import {loadComments} from "@/firebase/comments"
import getDateText from "@/functions/getDateText"
import Image from "next/image"

export default async function CommentList({slug}: {slug: string}) {
  const commentList = await loadComments(slug)
  return commentList.length === 0 ? (
    <p>No comments yet</p>
  ) : (
    <ul className="w-full divide-y divide-orange-700 rounded-lg border border-orange-700 bg-white">
      {commentList.map(
        ({id, text, time, user: {displayName = "Anonymous", photoURL}}) => (
          <li className="flex flex-col gap-3 p-4" key={id}>
            <span>{text}</span>
            <span className="flex items-center justify-end gap-2 text-right text-sm">
              {photoURL && (
                <Image
                  alt={`Profile picture of ${displayName}`}
                  className="h-6 w-6 rounded-full"
                  height={24}
                  src={photoURL}
                  width={24}
                />
              )}
              {displayName} - {getDateText(time, "short")}
            </span>
          </li>
        ),
      )}
    </ul>
  )
}
