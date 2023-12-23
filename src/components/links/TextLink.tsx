import Link, {LinkProps} from "next/link"

export function TextLink({
  className,
  href,
  text,
  variant,
  ...props
}: LinkProps & {
  className?: string
  text: string
  variant?: "filled" | "underlined"
}) {
  return (
    <Link
      className={[
        "text-center",
        className,
        variant === "filled"
          ? "rounded-xl border border-orange-700 bg-orange-700 px-4 py-1 font-bold text-white transition-colors hover:bg-white hover:text-orange-700"
          : variant === "underlined"
            ? "text-orange-700 underline"
            : "",
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
      {...{href}}
      {...(href.toString().startsWith("http") && {target: "_blank"})}
    >
      {text}
    </Link>
  )
}
