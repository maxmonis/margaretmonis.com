import {ArticleCard} from "@/components/ArticleCard"
import {CoreLink} from "@/components/CoreLink"
import {SubjectLinks} from "@/components/SubjectLinks"
import {imageDimensions} from "@/shared/constants"
import Image from "next/image"
import {notFound} from "next/navigation"
import {getSubjectText, isSubject, loadArticles} from "../functions"
import {loadArticle} from "./functions"
import {ArticleProps} from "./types"

export default async function ArticlePage({
  params: {slug, subject},
}: ArticleProps) {
  if (!isSubject(subject)) {
    notFound()
  }

  const article = await loadArticle({slug, subject})

  if (!article) {
    notFound()
  }

  const {
    date,
    image: {alt, url: src},
    text,
    title,
  } = article

  const subjectArticles = await loadArticles(subject)
  const articleIndex = subjectArticles.findIndex(a => a.slug === slug)
  const followingArticle = subjectArticles[articleIndex - 1]
  const previousArticle = subjectArticles[articleIndex + 1]

  return (
    <div className="flex flex-col items-center px-6">
      <div className="flex max-w-xl flex-col items-center">
        <h1 className="mb-10 text-center text-2xl font-bold sm:text-3xl">
          {title}
        </h1>
        <Image priority {...imageDimensions.sm} {...{alt, src}} />
        <h2 className="mt-10 text-center text-lg">
          {new Date(date).toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="my-10 flex flex-col gap-4">
          {text.split(/\r|\n/).map((text, i) => (
            <NestedContent key={i} {...{text}} />
          ))}
        </div>
        <CoreLink
          className="underline"
          href={`/${subject}/${article.slug}#top-of-page`}
        >
          Scroll to Top
        </CoreLink>
      </div>
      {subjectArticles.length > 1 && (
        <div className="mt-40">
          <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
            More from {getSubjectText(subject)}
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {previousArticle && (
              <ArticleCard article={previousArticle} {...{subject}} />
            )}
            {followingArticle && (
              <ArticleCard article={followingArticle} {...{subject}} />
            )}
          </div>
        </div>
      )}
      <div className="my-40">
        <h4 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          All Subjects
        </h4>
        <SubjectLinks />
      </div>
    </div>
  )
}

function NestedContent({text}: {text: string}) {
  if (!text) {
    return null
  }

  const [, alt, src] = text.match(/\!\[(.*?)\]\((.*?)\)/) ?? []
  if (src) {
    return <Image className="mx-auto" {...imageDimensions.sm} {...{alt, src}} />
  }

  return (
    <p
      dangerouslySetInnerHTML={{
        __html: text.replace(/\*(.*?)\*/g, "<em>$1</em>"),
      }}
    />
  )
}
