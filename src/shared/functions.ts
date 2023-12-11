import {subjects} from "./constants"
import {Subject} from "./types"

export function getDateText(date: string, monthFormat: "long" | "short") {
  return new Date(date.replace(/-/g, "/")).toLocaleDateString(undefined, {
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
