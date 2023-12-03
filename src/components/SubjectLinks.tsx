import {subjectImageAlt, subjects} from "../app/[subject]/constants"
import {getSubjectText} from "../app/[subject]/functions"
import {CardLink} from "./CardLink"

export function SubjectLinks({priority}: {priority?: boolean}) {
  return (
    <div className="flex w-full flex-wrap justify-center gap-6">
      {subjects.map(subject => (
        <CardLink
          alt={subjectImageAlt[subject]}
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
