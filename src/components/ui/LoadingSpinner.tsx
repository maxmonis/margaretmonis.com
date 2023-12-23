export default function LoadingSpinner({text}: {text: string}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-busy="true"
        className="h-5 w-5 animate-spin rounded-full border-4 border-blue-950 border-r-transparent"
        role="alert"
      />
      <p className="text-small">{text}</p>
    </div>
  )
}
