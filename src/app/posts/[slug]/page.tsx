import DateText from "@/components/ui/DateText"
import loadAllSlugs from "@/datocms/queries/loadAllSlugs"
import loadArticle from "@/datocms/queries/loadArticle"
import {ArticleProps} from "@/types"
import Image from "next/image"
import {notFound} from "next/navigation"

export default async function ArticlePage({params: {slug}}: ArticleProps) {
  const {article} = await loadArticle(slug)
  if (!article) {
    notFound()
  }
  return (
    <div className="flex max-w-xl flex-col items-center">
      <h1 className="mb-10 text-center text-2xl font-bold sm:text-3xl">
        {article.title}
      </h1>
      <Image
        alt={article.image.alt}
        className="max-h-96 w-full max-w-sm object-contain"
        height={384}
        priority
        src={article.image.url}
        width={384}
      />
      <h2 className="my-10 text-center text-lg">
        <DateText date={article.date} month="long" />
      </h2>
      <div className="flex flex-col gap-4">
        {article.text.split(/\r|\n/).map((text, i) => {
          if (!text.trim()) {
            return null
          }
          const [, alt, src] = text.match(/\!\[(.*?)\]\((.*?)\)/) ?? []
          return src ? (
            <Image
              className="mx-auto my-4 max-h-80 w-full max-w-xs object-contain"
              height={320}
              key={i}
              width={320}
              {...{alt, src}}
            />
          ) : (
            <p
              dangerouslySetInnerHTML={{
                __html: text.replace(/\*(.*?)\*/g, "<em>$1</em>"),
              }}
              key={i}
            />
          )
        })}
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const slugs = await loadAllSlugs()
  return slugs.map<ArticleProps["params"]>(slug => ({slug}))
}

export const dynamic = "force-static"
