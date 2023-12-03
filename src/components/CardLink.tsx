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
  title,
}: {
  alt: string
  href: string
  priority?: boolean
  src: string
  text?: string
  title: string
}) {
  return (
    <CoreLink {...{href}}>
      <div className="h-full w-screen max-w-xs rounded-lg border border-orange-700 bg-white p-4 transition hover:scale-105">
        <h3 className="mb-4 text-center text-xl font-bold">{title}</h3>
        <div>
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
