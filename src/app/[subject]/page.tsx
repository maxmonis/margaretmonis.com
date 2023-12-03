import {CardLink} from "@/components/CardLink"
import {notFound} from "next/navigation"
import {getSubjectText, isSubject, loadArticles} from "./functions"
import {SubjectProps} from "./types"

export default async function SubjectPage({params: {subject}}: SubjectProps) {
  if (!isSubject(subject)) {
    notFound()
  }

  const articles = await loadArticles(subject)

  return (
    <main className="flex h-full w-full flex-col items-center px-6 text-center">
      <h1 className="mb-10 text-2xl font-bold sm:text-3xl">
        {getSubjectText(subject)}
      </h1>
      <div className="flex max-w-5xl flex-wrap justify-center gap-6">
        {articles.map(({blurb, image: {alt, url}, slug, title}) => (
          <CardLink
            href={`/${subject}/${slug}`}
            key={slug}
            src={url}
            text={blurb}
            {...{alt, title}}
          />
        ))}
      </div>
    </main>
  )
}
