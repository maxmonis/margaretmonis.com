import Image from "next/image"

export function ArticleSection({text}: {text: string}) {
  if (!text) {
    return null
  }
  const [, alt, src] = text.match(/\!\[(.*?)\]\((.*?)\)/) ?? []
  return src ? (
    <Image
      className="mx-auto my-4 max-h-80 w-full max-w-xs object-contain"
      height={320}
      width={320}
      {...{alt, src}}
    />
  ) : (
    <p
      dangerouslySetInnerHTML={{
        __html: text.replace(/\*(.*?)\*/g, "<em>$1</em>"),
      }}
    />
  )
}
