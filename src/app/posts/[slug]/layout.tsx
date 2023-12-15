export default function ArticleLayout(props: {
  article: React.ReactNode
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <main className="flex flex-col items-center gap-40 px-4 sm:px-6">
      {props.children}
      {props.article}
      {props.footer}
    </main>
  )
}
