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

  const {
    image: {alt, height, url, width},
    text,
    title,
  } = await loadArticle({slug, subject})

  return (
    <div className="flex flex-col items-center px-6">
      <div className="max-w-xl">
        <h1 className="mb-10 text-center text-2xl font-bold sm:text-3xl">
          {title}
        </h1>
        <Image priority src={url} {...{alt, height, width}} />
        <div className="mt-10 flex flex-col gap-4">
          {text
            .split(/\r|\n/)
            .filter(Boolean)
            .map((paragraph, i) => (
              <p dangerouslySetInnerHTML={{__html: paragraph}} key={i} />
            ))}
        </div>
      </div>
    </div>
  )
}
