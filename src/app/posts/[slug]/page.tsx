import {loadAllSlugs, loadArticle} from "@/datocms/queries"
import {getSubjectText} from "@/shared/functions"
import {ArticleProps} from "@/shared/types"
import {Metadata} from "next"

export default function Page() {
  return <></>
}

export async function generateMetadata({params: {slug}}: ArticleProps) {
  const {article} = await loadArticle(slug)
  if (article) {
    const metadata: Metadata = {
      description: `An Article by Margaret Monis from her ${getSubjectText(
        article.subject,
      )} series`,
      openGraph: {
        images: [article.image],
      },
      title: article.title,
    }
    return metadata
  }
}

export async function generateStaticParams() {
  const slugs = await loadAllSlugs()
  return slugs.map<ArticleProps["params"]>(slug => ({slug}))
}
