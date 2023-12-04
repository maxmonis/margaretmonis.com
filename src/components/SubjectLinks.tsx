import {subjects} from "@/app/[subject]/constants"
import {getSubjectText} from "@/app/[subject]/functions"
import {CardLink} from "./CardLink"

export function SubjectLinks({priority}: {priority?: boolean}) {
  return (
    <div className="flex w-full flex-wrap justify-center gap-6">
      {subjects.map(subject => (
        <CardLink
          alt={imageAlt[subject]}
          href={`/${subject}`}
          key={subject}
          src={`/${subject}.jpg`}
          title={getSubjectText(subject)}
          {...{priority}}
        />
      ))}
    </div>
  )
}

const imageAlt = {
  "my-life":
    "A group of people clink their glasses together over a table laden with food",
  "social-commentary":
    "Women hold signs with hand-written slogans at a political demonstration",
  travel: "A hand holds a small globe aloft in front of a mountain range",
}
