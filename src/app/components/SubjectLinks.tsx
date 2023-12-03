import {subjectImageAlt, subjects} from "../[subject]/constants"
import {getSubjectText} from "../[subject]/functions"
import {CardLink} from "./CardLink"

export function SubjectLinks() {
  return (
    <div className="flex w-full flex-wrap justify-center gap-6">
      {subjects.map(subject => (
        <CardLink
          alt={subjectImageAlt[subject]}
          href={`/${subject}`}
          key={subject}
          priority
          src={`/${subject}.jpg`}
          title={getSubjectText(subject)}
        />
      ))}
    </div>
  )
}
