import {subjects} from "@/constants"
import {Subject} from "@/types"

export default function isSubject(subject: unknown): subject is Subject {
  return subjects.includes(subject as Subject)
}
