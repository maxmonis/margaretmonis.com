export default function RootLoader() {
  return (
    <main className="flex flex-col items-center px-6 py-20">
      <span
        aria-busy="true"
        className="h-24 w-24 animate-spin rounded-full border-8 border-blue-950 border-r-transparent"
        role="alert"
      />
    </main>
  )
}
