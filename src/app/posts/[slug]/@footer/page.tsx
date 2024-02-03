import ArticleLink from "@/components/links/ArticleLink"
import SubjectLinks from "@/components/links/SubjectLinks"
import TextLink from "@/components/links/TextLink"
import loadAllSlugs from "@/datocms/queries/loadAllSlugs"
import loadArticle from "@/datocms/queries/loadArticle"
import loadArticleList from "@/datocms/queries/loadArticleList"
import loadSubjectSlugs from "@/datocms/queries/loadSubjectSlugs"
import {ArticleProps} from "@/types"
import {getSubjectText} from "@/utils/parsers"
import {notFound} from "next/navigation"

export default async function FooterPage({params: {slug}}: ArticleProps) {
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
    <>
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
        <TextLink className="underline" href={"/"} text="Return Home" />
        <TextLink
          className="underline"
          href={`/posts/${slug}#top-of-page`}
          text="Scroll to Top"
        />
      </div>
    </>
  )
}

export async function generateStaticParams() {
  const slugs = await loadAllSlugs()
  return slugs.map<ArticleProps["params"]>(slug => ({slug}))
}

export const dynamic = "force-static"
