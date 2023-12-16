import {SubjectLinks, TextLink} from "@/components/links"
import {getSubjectText} from "@/shared/functions"
import {Article} from "@/shared/types"
import {CommentApp} from "./CommentApp"
import {SuggestedArticles} from "./SuggestedArticles"

export function ArticleFooter({
  article: {slug, subject, title},
}: {
  article: Omit<Article, "blurb">
}) {
  return (
    <>
      <div className="flex w-full max-w-xl flex-col items-center gap-6">
        <h3 className="text-center text-xl font-bold sm:text-2xl">Comments</h3>
        <CommentApp {...{slug, title}} />
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
