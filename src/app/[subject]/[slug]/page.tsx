import {CoreLink} from "@/app/components/CoreLink"
import {SubjectLinks} from "@/app/components/SubjectLinks"
import Image from "next/image"
import {notFound} from "next/navigation"
import {isSubject} from "../functions"
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
    image: {alt, url: src},
    text,
    title,
  } = article

  return (
    <div className="flex flex-col items-center px-6">
      <div className="mb-10 flex max-w-xl flex-col items-center">
        <h1 className="mb-10 text-center text-2xl font-bold sm:text-3xl">
          {title}
        </h1>
        <Image height={191} priority width={286} {...{alt, src}} />
        <div className="my-10 flex flex-col items-center gap-4">
          {text.split(/\r|\n/).map((text, i) => (
            <NestedContent key={i} {...{text}} />
          ))}
        </div>
      </div>
      <SubjectLinks />
      <div className="my-20">
        <CoreLink
          className="underline"
          href={`/${subject}/${article.slug}#top-of-page`}
        >
          Scroll to Top
        </CoreLink>
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
    return <Image height={191} width={286} {...{alt, src}} />
  }

  return (
    <p
      dangerouslySetInnerHTML={{
        __html: text.replace(/\*(.*?)\*/g, "<em>$1</em>"),
      }}
    />
  )
}
