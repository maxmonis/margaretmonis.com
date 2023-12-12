import {Article, Subject} from "./types"

export function loadArticle(variables: {slug: string; subject: Subject}) {
  return makeDatoRequest<Omit<Article, "blurb"> | null>({
    query: `
      query GetArticle($slug: String!, $subject: String!) {
        article(filter: {slug: {eq: $slug}, subject: {eq: $subject}}) {
          date
          image {
            alt
            url
          }
          slug
          subject
          text
          title
        }
      }
    `,
    variables,
  })
}

export function loadRecentArticles() {
  return makeDatoRequest<Array<Omit<Article, "text">>>({
    query: `
      query GetRecentArticles {
        allArticles(first: 3, orderBy: date_DESC) {
          ${preview}
        }
      }
    `,
  })
}

export function loadSubjectArticles(variables: {subject: Subject}) {
  return makeDatoRequest<Array<Omit<Article, "text">>>({
    query: `
      query GetSubjectArticles($subject: String!) {
        allArticles(filter: {subject: {eq: $subject}}, orderBy: date_DESC) {
          ${preview}
        }
      }
    `,
    variables,
  })
}

async function makeDatoRequest<T>({
  includeDrafts = process.env.NODE_ENV === "development",
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

const preview = `
  blurb
  date
  image {
    alt
    url(imgixParams: {fit: crop, h: 200, w: 200})
  }
  slug
  subject
  title
`
