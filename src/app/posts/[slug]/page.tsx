import {SubjectLinks, TextLink} from "@/components/links"
import {loadAllSlugs, loadArticle} from "@/datocms/queries"
import {getDateText, getSubjectText} from "@/shared/functions"
import {ArticleProps} from "@/shared/types"
import {Metadata} from "next"
import Image from "next/image"
import {notFound} from "next/navigation"
import {Comments} from "./components/Comments"
import {SuggestedArticles} from "./components/SuggestedArticles"

export default async function ArticlePage({params: {slug}}: ArticleProps) {
  const {article} = await loadArticle(slug)
  if (!article) {
    notFound()
  }
  return (
    <main className="flex flex-col items-center gap-40 px-4 sm:px-6">
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
          {getDateText({date: article.date, month: "long"})}
        </h2>
        <div className="flex flex-col gap-4">
          {article.text.split(/\r|\n/).map((text, i) => (
            <ArticleSection key={i} {...{text}} />
          ))}
        </div>
      </div>
      <div className="w-full">
        <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          Comments
        </h3>
        <Comments {...{slug}} />
      </div>
      <div>
        <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          More from {getSubjectText(article.subject)}
        </h3>
        <SuggestedArticles subject={article.subject} {...{slug}} />
      </div>
      <div>
        <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          All Subjects
        </h3>
        <SubjectLinks />
      </div>
      <TextLink
        className="underline"
        href={`/posts/${slug}#top-of-page`}
        text="Scroll to Top"
      />
    </main>
  )
}

function ArticleSection({text}: {text: string}) {
  if (!text.trim()) {
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

export async function generateMetadata({params: {slug}}: ArticleProps) {
  const {article} = await loadArticle(slug)
  if (article) {
    const metadata: Metadata = {
      description: `An Article by Margaret Monis from her ${getSubjectText(
        article.subject,
      )} series`,
      openGraph: {
        images: [article.image],
      },
      title: article.title,
    }
    return metadata
  }
}

export async function generateStaticParams() {
  const slugs = await loadAllSlugs()
  return slugs.map<ArticleProps["params"]>(slug => ({slug}))
}

export const dynamicParams = false
