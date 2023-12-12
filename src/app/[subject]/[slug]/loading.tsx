export default function ArticleLoader() {
  return (
    <main className="flex flex-col items-center gap-10 px-6">
      <span
        aria-busy="true"
        className="h-24 w-24 animate-spin rounded-full border-8 border-blue-950 border-r-transparent"
        role="alert"
      />
      <p className="text-lg">Loading article...</p>
    </main>
  )
}
