"use client"
import {Article} from "@/types"

/**
 * This client component ensures that the displayed date
 * reflects the current time zone of the user's device
 */
export default function DateText({
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
  const dateText = new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month,
    year: "numeric",
  })
  return <>{dateText}</>
}
