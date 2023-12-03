import classNames from "classnames"
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
      className={classNames(
        className,
        variant === "filled"
          ? "rounded-xl border border-orange-600 bg-orange-600 px-4 py-1 font-bold text-white transition-colors hover:bg-white hover:text-orange-600"
          : variant === "underlined"
            ? "text-orange-600 underline"
            : null,
      )}
      {...props}
      {...{href}}
      {...(href.toString().startsWith("http") ? {target: "_blank"} : {})}
    >
      {children}
    </Link>
  )
}
