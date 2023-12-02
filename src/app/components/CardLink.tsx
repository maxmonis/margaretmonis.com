import Image from "next/image"
import {CoreLink} from "./CoreLink"

export function CardLink({
  alt,
  href,
  priority,
  src,
  title,
}: {
  alt: string
  href: string
  priority?: boolean
  src: string
  title: string
}) {
  return (
    <CoreLink {...{href}}>
      <div className="w-screen max-w-xs flex-col rounded-lg border border-orange-700 bg-white p-4 transition hover:scale-105">
        <h3 className="mb-4 text-xl font-bold">{title}</h3>
        <Image height={191} width={286} {...{alt, priority, src}} />
      </div>
    </CoreLink>
  )
}
