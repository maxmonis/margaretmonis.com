import {loadComments} from "@/firebase/comments"
import {ArticleProps} from "@/types"
import {NextRequest, NextResponse} from "next/server"

export async function GET(_req: NextRequest, {params: {slug}}: ArticleProps) {
  try {
    const comments = await loadComments(slug)
    return NextResponse.json(comments)
  } catch (error) {
    console.error(error)
    throw Error(`Server error (ノಠ益ಠ)ノ彡┻━┻`)
  }
}
