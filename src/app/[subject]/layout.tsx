import {Metadata} from "next"
import {subjects} from "./constants"
import {getSubjectText, isSubject, loadArticles} from "./functions"
import {SubjectProps} from "./types"

export function generateStaticParams(): Array<SubjectProps["params"]> {
  return subjects.map(subject => ({subject}))
}

export async function generateMetadata({params: {subject}}: SubjectProps) {
  if (isSubject(subject)) {
    const articles = await loadArticles(subject)
    const subjectText = getSubjectText(subject)
    const metadata: Metadata = {
      description: `${subjectText} - Articles by Margaret Monis`,
      openGraph: {
        images: [articles[0].image],
      },
      title: subjectText,
    }
    return metadata
  }
}

export default function SubjectLayout({children}: {children: React.ReactNode}) {
  return children
}
