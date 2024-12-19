import CommentApp from "@/components/comments/CommentApp"
import ArticleLink from "@/components/links/ArticleLink"
import SubjectLinks from "@/components/links/SubjectLinks"
import TextLink from "@/components/links/TextLink"
import DateText from "@/components/ui/DateText"
import loadArticle from "@/datocms/queries/loadArticle"
import loadArticleList from "@/datocms/queries/loadArticleList"
import loadSubjectSlugs from "@/datocms/queries/loadSubjectSlugs"
import {ArticleProps} from "@/types"
import {getSubjectText} from "@/utils/parsers"
import Image from "next/image"
import {notFound} from "next/navigation"

export default async function ArticlePage({params}: ArticleProps) {
  const {slug} = await params
  const {article} = await loadArticle(slug)
  if (!article) {
    notFound()
  }
  const allSlugs = await loadSubjectSlugs(article.subject)
  const index = allSlugs.findIndex(s => s === slug)
  const slugs: Array<string> = []
  slugs.push(allSlugs[index - 1] ?? allSlugs.at(-1))
  slugs.push(allSlugs[index + 1] ?? allSlugs[0])
  const remainingSlugs = allSlugs.filter(s => ![slug, ...slugs].includes(s))
  slugs.push(remainingSlugs[Math.floor(Math.random() * remainingSlugs.length)])
  const {allArticles} = await loadArticleList(slugs)
  return (
    <main className="flex flex-col items-center gap-24 px-4 sm:px-6">
      <div className="flex flex-col items-center">
        <h1 className="mb-10 text-center text-2xl font-bold sm:text-3xl">
          {article.title}
        </h1>
        <Image
          alt={article.image.alt}
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
                className="max-w-prose"
                dangerouslySetInnerHTML={{
                  __html: text.replace(/\*(.*?)\*/g, "<em>$1</em>"),
                }}
                key={i}
              />
            )
          })}
        </div>
      </div>
      <CommentApp {...{article}} />
      <div>
        <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          More from {getSubjectText(article.subject)}
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          {allArticles.map(article => (
            <ArticleLink key={article.slug} {...{article}} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          All Subjects
        </h3>
        <SubjectLinks />
      </div>
      <div className="flex flex-wrap justify-center gap-10">
        <TextLink className="underline" href="/" text="Return Home" />
        <TextLink
          className="underline"
          href={`/posts/${slug}#top-of-page`}
          text="Scroll to Top"
        />
      </div>
    </main>
  )
}
