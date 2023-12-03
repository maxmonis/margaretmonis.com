import {capitalize, makeDatoRequest} from "@/shared/functions"
import {subjects} from "./constants"
import {Article, Subject} from "./types"

export function getSubjectText(subject: Subject) {
  return subject.split("-").map(capitalize).join(" ")
}

export function isSubject(subject: unknown): subject is Subject {
  return subjects.includes(subject as Subject)
}

export function loadArticles(subject: Subject) {
  return makeDatoRequest<Array<Omit<Article, "text">>>({
    query: `
      query GetSubjectArticles {
        allArticles(filter: {subject: {eq: "${subject}"}}, orderBy: date_DESC) {
          blurb
          date
          image {
            alt
            height
            title
            width
            url
          }
          slug
          subject
          title
        }
      }
    `,
  })
}
