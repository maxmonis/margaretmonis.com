import {Article} from "@/types"

export default function getDateText(
  date: Article["date"] | number,
  month: "long" | "short",
) {
  let dateString = ""
  if (typeof date === "number") {
    const time = new Date(date)
    const year = time.getFullYear()
    const month = (time.getMonth() + 1).toString().padStart(2, "0")
    const day = time.getDate().toString().padStart(2, "0")
    dateString = `${year}/${month}/${day}`
  } else {
    dateString = date.replace(/-/g, "/")
  }
  return new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month,
    year: "numeric",
  })
}
