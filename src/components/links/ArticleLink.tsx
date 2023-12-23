import getDateText from "@/functions/getDateText"
import {ArticlePreview} from "@/types"
import CardLink from "./CardLink"

export default function ArticleLink({
  article: {
    blurb: text,
    date,
    image: {alt, url: src},
    slug,
    title,
  },
  priority,
}: {
  article: ArticlePreview
  priority?: boolean
}) {
  return (
    <CardLink
      href={`/posts/${slug}`}
      subtitle={getDateText(date, "short")}
      {...{alt, priority, src, text, title}}
    />
  )
}
