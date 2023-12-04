import {makeDatoRequest} from "@/shared/functions"
import {subjects} from "./constants"
import {Article, Subject} from "./types"

export function getSubjectText(subject: Subject) {
  return subject
    .split("-")
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function isSubject(subject: unknown): subject is Subject {
  return subjects.includes(subject as Subject)
}

export function loadArticles(subject: Subject) {
  return makeDatoRequest<Array<Omit<Article, "text">>>({
    query: `
      query GetArticles($subject: String!) {
        allArticles(filter: {subject: {eq: $subject}}, orderBy: date_DESC) {
          blurb
          date
          image {
            alt
            url
          }
          slug
          subject
          title
        }
      }
    `,
    variables: {
      subject,
    },
  })
}
