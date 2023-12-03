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
    <div className="mx-auto flex max-w-xl flex-col items-center px-6">
      <h1 className="mb-10 text-center text-2xl font-bold sm:text-3xl">
        {title}
      </h1>
      <Image height={191} priority width={286} {...{alt, src}} />
      <div className="my-10 flex flex-col items-center gap-4">
        {text
          .split(/\r|\n/)
          .filter(Boolean)
          .map((paragraph, i) => (
            <p dangerouslySetInnerHTML={{__html: paragraph}} key={i} />
          ))}
      </div>
    </div>
  )
}
