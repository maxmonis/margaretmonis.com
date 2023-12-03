import {subjects} from "../constants"
import {loadArticles} from "../functions"
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

export default function ArticleLayout({children}: {children: React.ReactNode}) {
  return children
}
