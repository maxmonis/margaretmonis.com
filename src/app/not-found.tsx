import TextLink from "@/components/links/TextLink"

export default function NotFoundPage() {
  return (
    <main className="flex w-screen flex-col items-center gap-10 px-6 pb-72 pt-40 text-center">
      <h1 className="text-xl font-bold">Page Not Found</h1>
      <p>No content exists at the requested URL</p>
      <TextLink href="/" replace text="Return Home" variant="underlined" />
    </main>
  )
}
