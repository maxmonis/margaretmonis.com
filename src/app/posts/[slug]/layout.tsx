import {loadAllSlugs} from "@/datocms/queries/loadAllSlugs"
import {loadArticle} from "@/datocms/queries/loadArticle"
import {getSubjectText} from "@/functions/getSubjectText"
import {ArticleProps} from "@/types"
import {Metadata} from "next"

export default function ArticleLayout(props: React.PropsWithChildren) {
  return props.children
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

export const dynamicParams = false
