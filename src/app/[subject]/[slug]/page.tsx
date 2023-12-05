import {ArticleLink, SubjectLinks, TextLink} from "@/components/links"
import {subjects} from "@/shared/constants"
import {
  getSubjectText,
  isSubject,
  loadArticles,
  makeDatoRequest,
} from "@/shared/functions"
import {Article, Subject} from "@/shared/types"
import {Metadata} from "next"
import Image from "next/image"
import {notFound} from "next/navigation"

export default async function ArticlePage({
  params: {slug, subject},
}: ArticleProps) {
  if (!isSubject(subject)) notFound()
  const article = await loadArticle({slug, subject})
  if (!article) notFound()
  const articles = await loadArticles(subject)
  const articleIndex = articles.findIndex(a => a.slug === slug)
  const followingArticle = articles[articleIndex - 1] ?? articles.at(-1)
  const previousArticle = articles[articleIndex + 1] ?? articles[0]
  return (
    <main className="flex flex-col items-center px-4 sm:px-6">
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
          {new Date(article.date).toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex flex-col gap-4">
          {article.text.split(/\r|\n/).map((text, i) => (
            <NestedContent key={i} {...{text}} />
          ))}
        </div>
      </div>
      <div className="mt-20">
        <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          More from {getSubjectText(subject)}
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          <ArticleLink article={previousArticle} />
          <ArticleLink article={followingArticle} />
        </div>
      </div>
      <div className="my-20">
        <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          All Subjects
        </h3>
        <SubjectLinks />
      </div>
      <TextLink
        className="underline"
        href={`/${subject}/${article.slug}#top-of-page`}
        text="Scroll to Top"
      />
    </main>
  )
}

function NestedContent({text}: {text: string}) {
  if (!text) return null
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

export async function generateMetadata({
  params: {slug, subject},
}: ArticleProps) {
  if (isSubject(subject)) {
    const article = await loadArticle({slug, subject})
    if (article) {
      const metadata: Metadata = {
        description: `${article.title} - An Article by Margaret Monis`,
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
    const articles = await loadArticles(subject)
    for (const {slug} of articles) {
      params.push({slug, subject})
    }
  }
  return params
}

function loadArticle(variables: {slug: string; subject: Subject}) {
  return makeDatoRequest<Omit<Article, "blurb">>({
    query: `
      query GetArticle($slug: String!, $subject: String!) {
        article(filter: {slug: {eq: $slug}, subject: {eq: $subject}}) {
          date
          image {
            alt
            url
          }
          slug
          subject
          text
          title
        }
      }
    `,
    variables,
  })
}

type ArticleProps = {
  params: {
    slug: string
    subject: string
  }
}
