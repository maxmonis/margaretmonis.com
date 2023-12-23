import {Subject} from "@/types"

/**
 * eg. "my-life" -> "My Life"
 */
export default function getSubjectText(subject: Subject) {
  return subject
    .split("-")
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}
