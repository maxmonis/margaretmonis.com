import {SubjectLinks} from "./components/SubjectLinks"

export default function HomePage() {
  return (
    <main className="flex h-full w-full flex-col items-center px-6 text-center">
      <h1 className="text-2xl font-bold sm:text-3xl">Random Samplings</h1>
      <h2 className="mb-20 mt-4 text-xl font-bold sm:text-2xl">
        Margaret&apos;s Musings
      </h2>
      <SubjectLinks />
    </main>
  )
}
