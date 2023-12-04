import Link, {LinkProps} from "next/link"

export function CoreLink({
  children,
  className,
  href,
  variant,
  ...props
}: LinkProps & {
  children: React.ReactNode
  className?: string
  variant?: "filled" | "underlined"
}) {
  return (
    <Link
      {...props}
      {...{href}}
      {...(href.toString().startsWith("http") && {target: "_blank"})}
      {...((className || variant) && {
        className: [
          className,
          variant === "filled"
            ? "rounded-xl border border-orange-700 bg-orange-700 px-4 py-1 font-bold text-white transition-colors hover:bg-white hover:text-orange-700"
            : variant === "underlined"
              ? "text-orange-700 underline"
              : "",
        ]
          .filter(Boolean)
          .join(" "),
      })}
    >
      {children}
    </Link>
  )
}
