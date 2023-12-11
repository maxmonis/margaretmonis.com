import {ArticleLink, SubjectLinks, TextLink} from "@/components/links"
import {subjects} from "@/shared/constants"
import {loadArticle, loadSubjectArticles} from "@/shared/datocms"
import {getDateText, getSubjectText, isSubject} from "@/shared/functions"
import {Metadata} from "next"
import Image from "next/image"
import {notFound} from "next/navigation"
import {Suspense} from "react"
import {Comments} from "./comments"

export default async function ArticlePage({
  params: {slug, subject},
  searchParams: {action},
}: ArticleProps) {
  if (!isSubject(subject)) {
    notFound()
  }
  const article = await loadArticle({slug, subject})
  if (!article) {
    notFound()
  }
  const {
    date,
    image: {alt, url: src},
    text,
    title,
  } = article
  const articles = await loadSubjectArticles({subject})
  const articleIndex = articles.findIndex(a => a.slug === slug)
  const followingArticle = articles[articleIndex - 1] ?? articles.at(-1)
  const previousArticle = articles[articleIndex + 1] ?? articles[0]
  const remainingArticles = articles.filter(
    a => ![slug, previousArticle.slug, followingArticle.slug].includes(a.slug),
  )
  const additionalArticle =
    remainingArticles[Math.floor(Math.random() * remainingArticles.length)]
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
          <Suspense fallback={<p>Loading comments...</p>}>
            <Comments {...{action, slug, subject, title}} />
          </Suspense>
        </div>
      </div>
      <div className="mt-40">
        <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          More from {getSubjectText(subject)}
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          <ArticleLink article={previousArticle} />
          <ArticleLink article={followingArticle} />
          <ArticleLink article={additionalArticle} />
        </div>
      </div>
      <div className="my-40">
        <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          All Subjects
        </h3>
        <SubjectLinks />
      </div>
      <TextLink
        className="underline"
        href={`/${subject}/${slug}#top-of-page`}
        text="Scroll to Top"
      />
    </main>
  )
}

function ArticleSection({text}: {text: string}) {
  if (!text) {
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

export async function generateMetadata({
  params: {slug, subject},
}: ArticleProps) {
  if (isSubject(subject)) {
    const article = await loadArticle({slug, subject})
    if (article) {
      const metadata: Metadata = {
        description: `An Article by Margaret Monis from her ${getSubjectText(
          subject,
        )} series`,
        openGraph: {
          images: [article.image],
        },
        title: article.title,
      }
      return metadata
    }
  }
}

export async function generateStaticParams() {
  const params: Array<ArticleProps["params"]> = []
  for (const subject of subjects) {
    const articles = await loadSubjectArticles({subject})
    for (const {slug} of articles) {
      params.push({slug, subject})
    }
  }
  return params
}

type ArticleProps = {
  params: {
    slug: string
    subject: string
  }
  searchParams: {
    action?: string
  }
}
