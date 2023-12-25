import Image from "next/image"
import Link from "next/link"

export default function CardLink({
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
  subtitle?: React.ReactNode
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
