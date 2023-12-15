import {SubjectLinks, TextLink} from "@/components/links"
import {loadArticle} from "@/datocms/queries"
import {getSubjectText} from "@/shared/functions"
import {ArticleProps} from "@/shared/types"
import {notFound} from "next/navigation"
import {CommentsApp} from "./components/CommentsApp"
import {SuggestedArticles} from "./components/SuggestedArticles"

export default async function ArticleFooterPage({
  params: {slug},
}: ArticleProps) {
  const {article} = await loadArticle(slug)
  if (!article) {
    notFound()
  }
  const {subject, title} = article
  return (
    <>
      <div className="flex w-full max-w-xl flex-col items-center gap-6">
        <h3 className="text-center text-xl font-bold sm:text-2xl">Comments</h3>
        <CommentsApp {...{slug, subject, title}} />
      </div>
      <div>
        <h3 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          More from {getSubjectText(subject)}
        </h3>
        <SuggestedArticles {...{slug, subject}} />
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
    </>
  )
}

export const dynamic = "force-dynamic"
