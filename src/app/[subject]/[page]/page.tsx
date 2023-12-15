import {ArticleLink, TextLink} from "@/components/links"
import {loadSubjectArticleCount, loadSubjectArticles} from "@/datocms/queries"
import {subjects} from "@/shared/constants"
import {getSubjectText, isSubject} from "@/shared/functions"
import {Metadata} from "next"
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
              className="text-3xl"
              href={`/${subject}/${page - 1}`}
              text="<"
            />
          )}
          Page {page} of {Math.ceil(count / 12)}
          {page * 12 < count && (
            <TextLink
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

export async function generateMetadata({
  params: {subject, ...params},
}: SubjectProps) {
  const page = parseInt(params.page)
  if (page && isSubject(subject)) {
    const {allArticles} = await loadSubjectArticles({page, subject})
    if (allArticles.length) {
      const title = getSubjectText(subject)
      const metadata: Metadata = {
        description: `${title} - Articles by Margaret Monis`,
        openGraph: {
          images: [allArticles[0].image],
        },
        title,
      }
      return metadata
    }
  }
}

export async function generateStaticParams() {
  const params: Array<SubjectProps["params"]> = []
  for (const subject of subjects) {
    const count = await loadSubjectArticleCount(subject)
    let page = 0
    while (page * 12 < count) {
      page++
      params.push({page: page.toString(), subject})
    }
  }
  return params
}

type SubjectProps = {params: {page: string; subject: string}}
