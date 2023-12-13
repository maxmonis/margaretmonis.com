import {subjects} from "@/shared/constants"
import {loadArticle, loadSubjectSlugs} from "@/shared/datocms"
import {getSubjectText} from "@/shared/functions"
import {ArticleProps} from "@/shared/types"
import {Metadata} from "next"

export default function ArticleLayout({
  children,
  footer,
}: {
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <main className="flex flex-col items-center gap-40 px-4 sm:px-6">
      {children}
      {footer}
    </main>
  )
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
