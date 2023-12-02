import {subjects} from "./constants"

export function generateStaticParams() {
  return subjects.map(subject => ({subject}))
}

export default function SubjectLayout({children}: {children: React.ReactNode}) {
  return children
}
