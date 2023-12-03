import {Metadata} from "next"
import {subjects} from "../constants"
import {isSubject, loadArticles} from "../functions"
import {loadArticle} from "./functions"
import {ArticleProps} from "./types"

export async function generateStaticParams() {
  const params: Array<ArticleProps["params"]> = []
  for (const subject of subjects) {
    const articles = await loadArticles(subject)
    for (const {slug} of articles) {
      params.push({slug, subject})
    }
  }
  return params
}

export async function generateMetadata({
  params: {slug, subject},
}: ArticleProps) {
  if (isSubject(subject)) {
    const article = await loadArticle({slug, subject})
    if (article) {
      const {image, title} = article
      const metadata: Metadata = {
        description: `${title} - An Article by Margaret Monis`,
        openGraph: {
          images: [image],
        },
        title,
      }
      return metadata
    }
  }
}

export default function ArticleLayout({children}: {children: React.ReactNode}) {
  return children
}
