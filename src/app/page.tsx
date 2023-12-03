import {SubjectLinks} from "../components/SubjectLinks"

export default function HomePage() {
  return (
    <main className="flex h-full w-full flex-col items-center px-6 text-center">
      <h1 className="mb-20 text-2xl font-bold sm:text-3xl">
        Margaret&apos;s Musings
      </h1>
      <SubjectLinks />
    </main>
  )
}
