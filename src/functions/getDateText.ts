import {Article} from "@/types"

/**
 * Generates a localized date string for display in the UI
 */
export default function getDateText({
  date,
  month,
}: {
  date: Article["date"] | number
  month: "long" | "short"
}) {
  let dateString = ""
  if (typeof date === "number") {
    const time = new Date(date)
    const year = time.getFullYear()
    const month = (time.getMonth() + 1).toString().padStart(2, "0")
    const day = time.getDate().toString().padStart(2, "0")
    dateString = `${year}/${month}/${day}`
  } else {
    /* changing the hyphens to backslashes prevents a time zone issue */
    dateString = date.replace(/-/g, "/")
  }
  return new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month,
    year: "numeric",
  })
}
