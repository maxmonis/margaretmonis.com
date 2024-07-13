import ArticleLink from "@/components/links/ArticleLink"
import TextLink from "@/components/links/TextLink"
import loadSubjectArticles from "@/datocms/queries/loadSubjectArticles"
import {SubjectProps} from "@/types"
import {getSubjectText} from "@/utils/parsers"
import {isSubject} from "@/utils/validators"
import {notFound} from "next/navigation"

export default async function SubjectPage({
  params: {subject, ...params},
}: SubjectProps) {
  const page = parseInt(params.page)
  if (!page || !isSubject(subject)) {
    notFound()
  }
  const {
    allArticles,
    _allArticlesMeta: {count},
  } = await loadSubjectArticles({page, subject})
  if (allArticles.length === 0) {
    notFound()
  }
  return (
    <main className="flex h-full w-full flex-col items-center px-4 text-center sm:px-6">
      <h1 className="mb-20 text-2xl font-bold sm:text-3xl">
        {getSubjectText(subject)}
      </h1>
      <div className="flex max-w-5xl flex-wrap justify-center gap-6">
        {allArticles.map((article, i) => (
          <ArticleLink key={article.slug} priority={i < 3} {...{article}} />
        ))}
      </div>
      {count > 12 && (
        <div className="mt-12 flex items-center gap-4 text-xl font-bold">
          {page > 1 && (
            <TextLink
              aria-label="previous page"
              className="text-3xl"
              href={`/${subject}/${page - 1}`}
              text="<"
            />
          )}
          Page {page} of {Math.ceil(count / 12)}
          {page * 12 < count && (
            <TextLink
              aria-label="next page"
              className="text-3xl"
              href={`/${subject}/${page + 1}`}
              text=">"
            />
          )}
        </div>
      )}
    </main>
  )
}
