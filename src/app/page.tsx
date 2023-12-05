import {ArticleLink, SubjectLinks} from "@/components/links"
import {makeDatoRequest} from "@/shared/functions"
import {Article} from "@/shared/types"

export default async function HomePage() {
  const articles = await loadRecentArticles()
  return (
    <main className="flex h-full w-full flex-col items-center px-4 text-center sm:px-6">
      <h1 className="mb-20 text-2xl font-bold sm:text-3xl">
        Margaret&apos;s Musings
      </h1>
      <h2 className="mb-6 text-center text-xl font-bold sm:text-2xl">
        Subjects
      </h2>
      <SubjectLinks priority />
      <h2 className="mb-6 mt-20 text-center text-xl font-bold sm:text-2xl">
        Recently Published
      </h2>
      <div className="flex max-w-5xl flex-wrap justify-center gap-6">
        {articles.map(article => (
          <ArticleLink key={article.slug} priority {...{article}} />
        ))}
      </div>
    </main>
  )
}

function loadRecentArticles() {
  return makeDatoRequest<Array<Omit<Article, "text">>>({
    query: `
      query GetRecentArticles {
        allArticles(first: 3, orderBy: date_DESC) {
          blurb
          date
          image {
            alt
            url(imgixParams: {fit: crop, h: 200, w: 200})
          }
          slug
          subject
          title
        }
      }
    `,
  })
}
