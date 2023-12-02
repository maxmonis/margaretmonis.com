import Image from "next/image"
import {notFound} from "next/navigation"
import {getSubjectText, isSubject} from "./functions"
import {SubjectProps} from "./types"

export default function SubjectPage({params: {subject}}: SubjectProps) {
  if (!isSubject(subject)) {
    notFound()
  }

  const subjectText = getSubjectText(subject)

  return (
    <main className="flex h-full w-full flex-col items-center px-6 text-center">
      <h1 className="mb-10 text-2xl font-bold sm:text-3xl">{subjectText}</h1>
      <Image
        alt={subjectText}
        height={382}
        src={`/${subject}.jpg`}
        priority
        width={572}
      />
    </main>
  )
}
