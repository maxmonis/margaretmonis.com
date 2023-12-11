"use client"
import {TextLink} from "@/components/links"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  return (
    <main className="flex w-screen flex-col items-center gap-10 px-6 pb-72 pt-40 text-center">
      <h2 className="text-xl font-bold">An unexpected error occurred</h2>
      <p className="text-red-700">{error.message}</p>
      <button className="text-orange-700" onClick={reset}>
        Reload Page
      </button>
      <TextLink href="/" text="Return Home" replace variant="underlined" />
    </main>
  )
}
