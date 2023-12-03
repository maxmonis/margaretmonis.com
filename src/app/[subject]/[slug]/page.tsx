import {CoreLink} from "@/app/components/CoreLink"
import Image from "next/image"
import {notFound} from "next/navigation"
import {subjects} from "../constants"
import {getSubjectText, isSubject} from "../functions"
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
    <div className="mx-auto flex max-w-xl flex-col items-center px-6">
      <h1 className="mb-10 text-center text-2xl font-bold sm:text-3xl">
        {title}
      </h1>
      <Image height={191} priority width={286} {...{alt, src}} />
      <div className="my-10 flex flex-col items-center gap-4">
        {text.split(/\r|\n/).map((text, i) => (
          <NestedContent key={i} {...{text}} />
        ))}
      </div>
      <CoreLink href={`/${subject}`} variant="underlined">
        {getSubjectText(subject)}
      </CoreLink>
      <div className="my-10 flex flex-wrap justify-center gap-10">
        {subjects
          .filter(s => s !== subject)
          .map(slug => (
            <CoreLink href={`/${slug}`} key={slug} variant="underlined">
              {getSubjectText(slug)}
            </CoreLink>
          ))}
      </div>
      <div className="mb-20">
        <CoreLink
          className="hover:underline"
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
  if (alt && src) {
    return <Image height={191} width={286} {...{alt, src}} />
  }

  return <p dangerouslySetInnerHTML={{__html: text}} />
}
