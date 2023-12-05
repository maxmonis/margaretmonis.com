import {ArticleCard} from "@/components/ArticleCard"
import {SubjectLinks} from "@/components/SubjectLinks"
import {TextLink} from "@/components/TextLink"
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

  const articles = await loadArticles(subject)
  const articleIndex = articles.findIndex(a => a.slug === slug)
  const followingArticle = articles[articleIndex - 1] ?? articles.at(-1)
  const previousArticle = articles[articleIndex + 1] ?? articles[0]

  return (
    <main className="flex flex-col items-center px-6">
      <div className="flex max-w-xl flex-col items-center">
        <h1 className="mb-10 text-center text-2xl font-bold sm:text-3xl">
          {title}
        </h1>
        <Image
          className="max-h-96 w-full max-w-sm object-contain"
          height={384}
          priority
          width={384}
          {...{alt, src}}
        />
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
        <TextLink
          className="underline"
          href={`/${subject}/${article.slug}#top-of-page`}
          text="Scroll to Top"
        />
      </div>
      <div className="mt-40">
        <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          More from {getSubjectText(subject)}
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          <ArticleCard article={previousArticle} {...{subject}} />
          <ArticleCard article={followingArticle} {...{subject}} />
        </div>
      </div>
      <div className="my-40">
        <h4 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          All Subjects
        </h4>
        <SubjectLinks />
      </div>
    </main>
  )
}

function NestedContent({text}: {text: string}) {
  if (!text) {
    return null
  }

  const [, alt, src] = text.match(/\!\[(.*?)\]\((.*?)\)/) ?? []
  if (src) {
    return (
      <Image
        className="mx-auto my-4 max-h-80 w-full max-w-xs object-contain"
        height={320}
        width={320}
        {...{alt, src}}
      />
    )
  }

  return (
    <p
      dangerouslySetInnerHTML={{
        __html: text.replace(/\*(.*?)\*/g, "<em>$1</em>"),
      }}
    />
  )
}
