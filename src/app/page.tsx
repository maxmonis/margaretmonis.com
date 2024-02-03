import ArticleLink from "@/components/links/ArticleLink"
import SubjectLinks from "@/components/links/SubjectLinks"
import loadRecentArticles from "@/datocms/queries/loadRecentArticles"

export default async function HomePage() {
  const {allArticles} = await loadRecentArticles()
  return (
    <main className="flex h-full w-full flex-col items-center px-4 text-center sm:px-6">
      <h1 className="mb-20 text-2xl font-bold sm:text-3xl">
        Margaret&apos;s Musings
      </h1>
      <h2 className="mb-6 text-center text-xl font-bold sm:text-2xl">
        Recently Published
      </h2>
      <div className="mb-20 flex max-w-5xl flex-wrap justify-center gap-6">
        {allArticles.map(article => (
          <ArticleLink key={article.slug} priority {...{article}} />
        ))}
      </div>
      <h2 className="mb-6 text-center text-xl font-bold sm:text-2xl">
        Subjects
      </h2>
      <SubjectLinks priority />
    </main>
  )
}
