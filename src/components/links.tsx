import {subjects} from "@/shared/constants"
import {getDateText, getSubjectText} from "@/shared/functions"
import {Article} from "@/shared/types"
import Image from "next/image"
import Link, {LinkProps} from "next/link"

export function ArticleLink({
  article: {
    blurb: text,
    date,
    image: {alt, url: src},
    slug,
    subject,
    title,
  },
  priority,
}: {
  article: Omit<Article, "text">
  priority?: boolean
}) {
  return (
    <CardLink
      href={`/${subject}/${slug}`}
      subtitle={getDateText(date, "short")}
      {...{alt, priority, src, text, title}}
    />
  )
}

function CardLink({
  alt,
  href,
  priority,
  src,
  subtitle,
  text,
  title,
}: {
  alt: string
  href: string
  priority?: boolean
  src: string
  subtitle?: string
  text?: string
  title: string
}) {
  return (
    <Link {...{href}}>
      <div className="h-full w-full max-w-xs rounded-lg border border-orange-700 bg-white p-4 text-center transition hover:scale-105">
        <p className="text-xl font-bold leading-tight">{title}</p>
        {subtitle && <p className="pb-2 pt-1 text-sm">{subtitle}</p>}
        <div className="pt-2">
          <Image
            {...{
              alt,
              priority,
              src,
              ...(text
                ? {className: "float-left mr-4", height: 100, width: 100}
                : {height: 191, width: 286}),
            }}
          />
        </div>
        {text && <p className="text-left">{text}</p>}
      </div>
    </Link>
  )
}

export function SubjectLinks({priority}: {priority?: boolean}) {
  return (
    <div className="flex w-full flex-wrap justify-center gap-6">
      {subjects.map(subject => (
        <CardLink
          alt={imageAlt[subject]}
          href={`/${subject}`}
          key={subject}
          src={`/${subject}.jpg`}
          title={getSubjectText(subject)}
          {...{priority}}
        />
      ))}
    </div>
  )
}

export function TextLink({
  className,
  href,
  text,
  variant,
  ...props
}: LinkProps & {
  className?: string
  text: string
  variant?: "filled" | "underlined"
}) {
  return (
    <Link
      {...props}
      {...{href}}
      {...(href.toString().startsWith("http") && {target: "_blank"})}
      {...((className || variant) && {
        className: [
          "text-center",
          className,
          variant === "filled"
            ? "rounded-xl border border-orange-700 bg-orange-700 px-4 py-1 font-bold text-white transition-colors hover:bg-white hover:text-orange-700"
            : variant === "underlined"
              ? "text-orange-700 underline"
              : "",
        ]
          .filter(Boolean)
          .join(" "),
      })}
    >
      {text}
    </Link>
  )
}

const imageAlt = {
  "my-life":
    "A group of people clink their glasses together over a table laden with food",
  "social-commentary":
    "Women hold signs with hand-written slogans at a political demonstration",
  travel: "A hand holds a small globe aloft in front of a mountain range",
}
