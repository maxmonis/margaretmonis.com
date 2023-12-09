import {
  ArticleLink,
  LoginLink,
  LogoutLink,
  SignupLink,
  SubjectLinks,
  TextLink,
} from "@/components/links"
import {subjects} from "@/shared/constants"
import {
  getDateText,
  getSubjectText,
  getUserProfile,
  isSubject,
  loadSubjectArticles,
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
  const articles = await loadSubjectArticles(subject)
  const articleIndex = articles.findIndex(a => a.slug === slug)
  const followingArticle = articles[articleIndex - 1] ?? articles.at(-1)
  const previousArticle = articles[articleIndex + 1] ?? articles[0]
  const remainingArticles = articles.filter(
    a => ![slug, previousArticle.slug, followingArticle.slug].includes(a.slug),
  )
  const randomArticle =
    remainingArticles[Math.floor(Math.random() * remainingArticles.length)]
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
          {getDateText(article.date, "long")}
        </h2>
        <div className="flex flex-col gap-4">
          {article.text.split(/\r|\n/).map((text, i) => (
            <ArticleSection key={i} {...{text}} />
          ))}
        </div>
        <Comments {...{slug, subject}} />
      </div>
      <div className="mt-40">
        <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          More from {getSubjectText(subject)}
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          <ArticleLink article={previousArticle} />
          <ArticleLink article={followingArticle} />
          <ArticleLink article={randomArticle} />
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
        href={`/${subject}/${article.slug}#top-of-page`}
        text="Scroll to Top"
      />
    </main>
  )
}

function ArticleSection({text}: {text: string}) {
  if (!text) return null
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

async function Comments({slug, subject}: ArticleProps["params"]) {
  async function action(formData: FormData) {
    "use server"
    const text = formData.get("text")
    console.info({slug, subject, text})
  }
  const returnTo = `/${subject}/${slug}#comments` as const
  const user = await getUserProfile()
  return (
    <div
      className="flex w-full flex-col items-center gap-6 pt-20"
      id="comments"
    >
      <h3 className="text-center text-xl font-bold sm:text-2xl">Comments</h3>
      {user ? (
        <>
          <form className="flex w-full flex-col items-center" {...{action}}>
            <textarea
              className="w-full rounded-lg border border-orange-700 p-4"
              maxLength={2000}
              name="text"
              placeholder="Add a comment..."
              required
            />
            <button
              className="mt-4 text-lg uppercase text-orange-700"
              type="submit"
            >
              Save Comment
            </button>
          </form>
          <div className="flex">
            <p className="mr-2">Commenting as {user.name}</p>
            <LogoutLink />
          </div>
        </>
      ) : (
        <>
          <p>Please log in to add a comment</p>
          <LoginLink {...{returnTo}} />
          <SignupLink {...{returnTo}} />
        </>
      )}
    </div>
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
    const articles = await loadSubjectArticles(subject)
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
