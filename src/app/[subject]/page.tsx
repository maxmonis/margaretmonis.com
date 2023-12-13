import {ArticleLink} from "@/components/links"
import {subjects} from "@/shared/constants"
import {loadSubjectArticles} from "@/shared/datocms"
import {getSubjectText, isSubject} from "@/shared/functions"
import {Metadata} from "next"
import {notFound} from "next/navigation"

export default async function SubjectPage({params: {subject}}: SubjectProps) {
  if (!isSubject(subject)) {
    notFound()
  }
  const {allArticles} = await loadSubjectArticles({subject})
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
    </main>
  )
}

export async function generateMetadata({params: {subject}}: SubjectProps) {
  if (isSubject(subject)) {
    const {allArticles} = await loadSubjectArticles({subject})
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
}
