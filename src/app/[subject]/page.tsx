import {ArticleLink, TextLink} from "@/components/links"
import {loadSubjectArticles} from "@/datocms/functions"
import {subjects} from "@/shared/constants"
import {getSubjectText, isSubject} from "@/shared/functions"
import {Metadata} from "next"
import {notFound} from "next/navigation"

export default async function SubjectPage({
  params: {subject},
  searchParams,
}: SubjectProps) {
  if (!isSubject(subject)) {
    notFound()
  }
  const page = Number(searchParams.page) || 1
  const {
    allArticles,
    _allArticlesMeta: {count},
  } = await loadSubjectArticles({page, subject})
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
        <div className="mt-10 flex items-center gap-4 text-xl font-bold">
          {page > 1 && (
            <TextLink
              className="text-3xl"
              href={`/${subject}${page === 2 ? "" : `?page=${page - 1}`}`}
              text="<"
            />
          )}
          Page {page} of {Math.ceil(count / 12)}
          {page * 12 < count && (
            <TextLink
              className="text-3xl"
              href={`/${subject}?page=${page + 1}`}
              text=">"
            />
          )}
        </div>
      )}
    </main>
  )
}

export async function generateMetadata({
  params: {subject},
  searchParams,
}: SubjectProps) {
  if (isSubject(subject)) {
    const page = Number(searchParams.page) || 1
    const {allArticles} = await loadSubjectArticles({page, subject})
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

export function generateStaticParams(): Array<SubjectProps["params"]> {
  return subjects.map(subject => ({subject}))
}

type SubjectProps = {
  params: {subject: string}
  searchParams: {page?: string}
}
