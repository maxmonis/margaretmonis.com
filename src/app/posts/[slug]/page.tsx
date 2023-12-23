import SubjectLinks from "@/components/links/SubjectLinks"
import TextLink from "@/components/links/TextLink"
import loadArticle from "@/datocms/queries/loadArticle"
import getDateText from "@/functions/getDateText"
import getSubjectText from "@/functions/getSubjectText"
import {ArticleProps} from "@/types"
import Image from "next/image"
import {notFound} from "next/navigation"
import ArticleComments from "./components/ArticleComments"
import ArticleSection from "./components/ArticleSection"
import SuggestedArticles from "./components/SuggestedArticles"

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
          {getDateText(article.date, "long")}
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
        <ArticleComments title={article.title} {...{slug}} />
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
