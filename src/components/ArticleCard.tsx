import {Article} from "@/app/[subject]/[slug]/types"
import {Subject} from "@/app/[subject]/types"
import {CardLink} from "./CardLink"

export function ArticleCard({
  article: {
    blurb: text,
    date,
    image: {alt, url: src},
    slug,
    title,
  },
  priority,
  subject,
}: {
  article: Omit<Article, "text">
  priority?: boolean
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
      {...{alt, priority, src, text, title}}
    />
  )
}
