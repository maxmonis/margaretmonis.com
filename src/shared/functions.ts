import {subjects} from "./constants"
import {Subject} from "./types"

export function getDateText({
  date,
  monthFormat,
}: {
  date: number | string
  monthFormat: "long" | "short"
}) {
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
    month: monthFormat,
    year: "numeric",
  })
}

export function getSubjectText(subject: Subject) {
  return subject
    .split("-")
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

export function isSubject(subject: unknown): subject is Subject {
  return subjects.includes(subject as Subject)
}
