import {Article, Subject} from "@/app/[subject]/types"
import {CardLink} from "./CardLink"

export function ArticleCard({
  article: {
    blurb: text,
    date,
    image: {alt, url: src},
    slug,
    title,
  },
  subject,
}: {
  article: Omit<Article, "text">
  subject: Subject
}) {
  return (
    <CardLink
      href={`/${subject}/${slug}`}
      subtitle={new Date(date).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
      {...{alt, src, text, title}}
    />
  )
}
