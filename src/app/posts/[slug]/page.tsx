import {SubjectLinks, TextLink} from "@/components/links"
import {subjects} from "@/shared/constants"
import {loadArticle, loadSubjectSlugs} from "@/shared/datocms"
import {getDateText, getSubjectText} from "@/shared/functions"
import {Metadata} from "next"
import Image from "next/image"
import {notFound} from "next/navigation"
import React from "react"
import {ArticleSection} from "./components/ArticleSection"
import {CommentsApp} from "./components/CommentsApp"
import {SuggestedArticles} from "./components/SuggestedArticles"

export default async function ArticlePage({params: {slug}}: ArticleProps) {
  const {article} = await loadArticle({slug})
  if (!article) {
    notFound()
  }
  const {
    date,
    image: {alt, url: src},
    subject,
    text,
    title,
  } = article
  return (
    <main className="flex flex-col items-center px-4 sm:px-6">
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
        <h2 className="my-10 text-center text-lg">
          {getDateText(date, "long")}
        </h2>
        <div className="flex flex-col gap-4">
          {text.split(/\r|\n/).map((text, i) => (
            <ArticleSection key={i} {...{text}} />
          ))}
        </div>
        <div
          className="flex w-full flex-col items-center gap-6 pt-20"
          id="comments"
        >
          <h3 className="text-center text-xl font-bold sm:text-2xl">
            Comments
          </h3>
          <React.Suspense fallback={<p>Loading comments...</p>}>
            <CommentsApp {...{slug, subject, title}} />
          </React.Suspense>
        </div>
      </div>
      <React.Suspense fallback={<></>}>
        <SuggestedArticles {...{slug, subject}} />
      </React.Suspense>
      <div className="my-40">
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

export async function generateMetadata({params: {slug}}: ArticleProps) {
  const {article} = await loadArticle({slug})
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
  const params: Array<ArticleProps["params"]> = []
  for (const subject of subjects) {
    const slugs = await loadSubjectSlugs({subject})
    for (const slug of slugs) {
      params.push({slug})
    }
  }
  return params
}

type ArticleProps = {params: {slug: string}}
