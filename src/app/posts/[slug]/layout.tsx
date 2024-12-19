import loadAllSlugs from "@/datocms/queries/loadAllSlugs"
import loadArticle from "@/datocms/queries/loadArticle"
import {ArticleProps} from "@/types"
import {getSubjectText} from "@/utils/parsers"
import {Metadata} from "next"

export default function ArticleLayout({children}: React.PropsWithChildren) {
  return children
}

export async function generateMetadata({params}: ArticleProps) {
  const {slug} = await params
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

export async function generateStaticParams() {
  const slugs = await loadAllSlugs()
  return slugs.map<Awaited<ArticleProps["params"]>>(slug => ({slug}))
}

export const dynamic = "force-static"
