import {Subject} from "./types"

export const subjects = ["travel", "social-commentary", "my-life"] as const

export const subjectImageAlt: Record<Subject, string> = {
  "my-life":
    "A group of people clink their glasses together over a table laden with food",
  "social-commentary":
    "Women hold signs with hand-written slogans at a political demonstration",
  travel: "A hand holds a small globe aloft in front of a mountain range",
}
