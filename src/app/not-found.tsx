import {CoreLink} from "@/components/CoreLink"

export default function NotFoundPage() {
  return (
    <main className="flex w-screen flex-col items-center gap-10 px-6 pb-72 pt-40 text-center">
      <h2 className="text-xl font-bold">Page Not Found</h2>
      <p>No content exists at the requested URL</p>
      <CoreLink href="/" replace variant="underlined">
        Return Home
      </CoreLink>
    </main>
  )
}
