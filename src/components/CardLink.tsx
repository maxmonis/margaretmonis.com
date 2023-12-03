import classNames from "classnames"
import Image from "next/image"
import {imageDimensions} from "../shared/constants"
import {CoreLink} from "./CoreLink"

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
    <CoreLink {...{href}}>
      <div className="h-full w-screen max-w-xs rounded-lg border border-orange-700 bg-white p-4 text-center transition hover:scale-105">
        <p className="text-xl font-bold leading-tight">{title}</p>
        {subtitle && <p className="mt-1 text-sm">{subtitle}</p>}
        <div className="mt-4">
          <Image
            className={classNames(text && "float-left mr-4")}
            {...imageDimensions[text ? "xs" : "sm"]}
            {...{alt, priority, src}}
          />
        </div>
        {text && <p className="text-left">{text}</p>}
      </div>
    </CoreLink>
  )
}
