import {ArticleLink} from "@/components/links/ArticleLink"
import {loadArticleList} from "@/datocms/queries/loadArticleList"
import {loadSubjectSlugs} from "@/datocms/queries/loadSubjectSlugs"
import {Subject} from "@/types"

export async function SuggestedArticles({
  slug,
  subject,
}: {
  slug: string
  subject: Subject
}) {
  const allSlugs = await loadSubjectSlugs(subject)
  const index = allSlugs.findIndex(s => s === slug)
  const slugs: Array<string> = []
  slugs.push(allSlugs[index - 1] ?? allSlugs.at(-1))
  slugs.push(allSlugs[index + 1] ?? allSlugs[0])
  const remainingSlugs = allSlugs.filter(s => ![slug, ...slugs].includes(s))
  slugs.push(remainingSlugs[Math.floor(Math.random() * remainingSlugs.length)])
  const {allArticles} = await loadArticleList(slugs)
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {allArticles.map(article => (
        <ArticleLink key={article.slug} {...{article}} />
      ))}
    </div>
  )
}
