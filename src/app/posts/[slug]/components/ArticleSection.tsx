import Image from "next/image"

export default function ArticleSection({text}: {text: string}) {
  if (!text.trim()) {
    return null
  }
  const [, alt, src] = text.match(/\!\[(.*?)\]\((.*?)\)/) ?? []
  if (src) {
    return (
      <Image
        className="mx-auto my-4 max-h-80 w-full max-w-xs object-contain"
        height={320}
        width={320}
        {...{alt, src}}
      />
    )
  }
  return (
    <p
      dangerouslySetInnerHTML={{
        __html: text.replace(/\*(.*?)\*/g, "<em>$1</em>"),
      }}
    />
  )
}
