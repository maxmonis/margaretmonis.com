import {ArticleLink} from "@/components/links"
import {loadSubjectArticles} from "@/shared/datocms"
import {getSubjectText} from "@/shared/functions"
import {Subject} from "@/shared/types"

export async function SuggestedArticles({
  slug,
  subject,
}: {
  slug: string
  subject: Subject
}) {
  const articles = await loadSubjectArticles({subject})
  const articleIndex = articles.findIndex(a => a.slug === slug)
  const followingArticle = articles[articleIndex - 1] ?? articles.at(-1)
  const previousArticle = articles[articleIndex + 1] ?? articles[0]
  const remainingArticles = articles.filter(
    a => ![slug, previousArticle.slug, followingArticle.slug].includes(a.slug),
  )
  const additionalArticle =
    remainingArticles[Math.floor(Math.random() * remainingArticles.length)]
  return (
    <div className="mt-40">
      <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
        More from {getSubjectText(subject)}
      </h3>
      <div className="flex flex-wrap justify-center gap-6">
        <ArticleLink article={previousArticle} />
        <ArticleLink article={followingArticle} />
        <ArticleLink article={additionalArticle} />
      </div>
    </div>
  )
}
