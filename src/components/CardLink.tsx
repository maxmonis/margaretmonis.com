import Image from "next/image"
import Link from "next/link"

export function CardLink({
  alt,
  href,
  priority,
  src,
  text,
  subtitle,
  title,
}: {
  alt: string
  href: string
  priority?: boolean
  src: string
  text?: string
  subtitle?: string
  title: string
}) {
  return (
    <Link {...{href}}>
      <div className="h-full w-screen max-w-xs rounded-lg border border-orange-700 bg-white p-4 text-center transition hover:scale-105">
        <p className="text-xl font-bold leading-tight">{title}</p>
        {subtitle && <p className="mt-1 text-sm">{subtitle}</p>}
        <div className="mt-4">
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
