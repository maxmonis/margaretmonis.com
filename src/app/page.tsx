import {SubjectLinks} from "@/components/links"

export default function HomePage() {
  return (
    <main className="flex h-full w-full flex-col items-center px-4 text-center sm:px-6">
      <h1 className="mb-20 text-2xl font-bold sm:text-3xl">
        Margaret&apos;s Musings
      </h1>
      <SubjectLinks priority />
    </main>
  )
}
