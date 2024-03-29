import DateText from "@/components/ui/DateText"
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
      subtitle={<DateText month="short" {...{date}} />}
      {...{alt, priority, src, text, title}}
    />
  )
}
