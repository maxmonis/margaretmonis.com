import {loadArticle} from "@/datocms/functions"
import {getDateText} from "@/shared/functions"
import {ArticleProps} from "@/shared/types"
import Image from "next/image"
import {notFound} from "next/navigation"

export default async function ArticlePage({params: {slug}}: ArticleProps) {
  const {article} = await loadArticle(slug)
  if (!article) {
    notFound()
  }
  const {
    date,
    image: {alt, url: src},
    text,
    title,
  } = article
  return (
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
      <h2 className="my-10 text-center text-lg">{getDateText(date, "long")}</h2>
      <div className="flex flex-col gap-4">
        {text.split(/\r|\n/).map((text, i) => (
          <ArticleSection key={i} {...{text}} />
        ))}
      </div>
    </div>
  )
}

export function ArticleSection({text}: {text: string}) {
  if (!text.trim()) {
    return null
  }
  const [, alt, src] = text.match(/\!\[(.*?)\]\((.*?)\)/) ?? []
  return src ? (
    <Image
      className="mx-auto my-4 max-h-80 w-full max-w-xs object-contain"
      height={320}
      width={320}
      {...{alt, src}}
    />
  ) : (
    <p
      dangerouslySetInnerHTML={{
        __html: text.replace(/\*(.*?)\*/g, "<em>$1</em>"),
      }}
    />
  )
}
