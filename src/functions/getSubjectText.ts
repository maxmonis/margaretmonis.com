import {Subject} from "@/types"

export function getSubjectText(subject: Subject) {
  return subject
    .split("-")
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}
