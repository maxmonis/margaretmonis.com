import loadArticle from "@/datocms/queries/loadArticle"
import {ArticleProps} from "@/types"
import {getSubjectText} from "@/utils/parsers"
import {Metadata} from "next"

export default function ArticleLayout({
  children,
  comments,
  footer,
}: React.PropsWithChildren & {
  comments: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <main className="flex flex-col items-center gap-40 px-4 sm:px-6">
      {children}
      {comments}
      {footer}
    </main>
  )
}

export async function generateMetadata({params: {slug}}: ArticleProps) {
  const {article} = await loadArticle(slug)
  if (article) {
    const metadata: Metadata = {
      description: `${
        article.title
      } by Margaret Monis from her ${getSubjectText(article.subject)} series`,
      openGraph: {images: [article.image]},
      title: article.title,
    }
    return metadata
  }
}
