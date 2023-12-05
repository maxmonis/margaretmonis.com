import {subjects} from "./constants"
import {Article, Subject} from "./types"

export function getSubjectText(subject: Subject) {
  return subject
    .split("-")
    .map(word => word[0].toUpperCase() + word.slice(1))
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
            url(imgixParams: {fit: crop, h: 200, w: 200})
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

export async function makeDatoRequest<T>({
  includeDrafts,
  query,
  variables = {},
}: {
  includeDrafts?: boolean
  query: string
  variables?: object
}) {
  const response = await fetch("https://graphql.datocms.com/", {
    body: JSON.stringify({query, variables}),
    headers: {
      Authorization: `Bearer ${process.env.NEXT_DATOCMS_API_TOKEN}`,
      ...(includeDrafts && {"X-Include-Drafts": "true"}),
    },
    method: "POST",
    next: {
      revalidate: 3600,
    },
  })
  const responseBody = await response.json()
  if (!response.ok) {
    throw Error(
      `${response.status} ${response.statusText}: ${JSON.stringify(
        responseBody,
      )}`,
    )
  }
  return Object.values(responseBody.data)[0] as T
}
