import {loadArticle, loadSubjectSlugs} from "@/datocms/queries"
import {subjects} from "@/shared/constants"
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
  const params: Array<ArticleProps["params"]> = []
  for (const subject of subjects) {
    const slugs = await loadSubjectSlugs(subject)
    for (const slug of slugs) {
      params.push({slug})
    }
  }
  return params
}
