import {Article, Subject} from "./types"

export function loadArticle(slug: string) {
  return makeDatoRequest<{article: Omit<Article, "blurb"> | null}>({
    query: `
      query GetArticle($slug: String!) {
        article(filter: {slug: {eq: $slug}}) {
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
    variables: {slug},
  })
}

export function loadArticleList(slugs: Array<string>) {
  return makeDatoRequest<{
    allArticles: Array<Omit<Article, "text">>
  }>({
    query: `
        query GetSuggestedArticles($slugs: [String]!) {
          allArticles(
            filter: {slug: {in: $slugs}}
            orderBy: date_DESC
          ) {
            ${preview}
          }
        }
      `,
    variables: {slugs},
  })
}

export function loadRecentArticles() {
  return makeDatoRequest<{allArticles: Array<Omit<Article, "text">>}>({
    query: `
      query GetRecentArticles {
        allArticles(first: 3, orderBy: date_DESC) {
          ${preview}
        }
      }
    `,
  })
}

export function loadSubjectArticles({
  page,
  subject,
}: {
  page: number
  subject: Subject
}) {
  return makeDatoRequest<{
    allArticles: Array<Omit<Article, "text">>
    _allArticlesMeta: {count: number}
  }>({
    query: `
      query GetSubjectArticles($subject: String!) {
        allArticles(
          filter: {subject: {eq: $subject}}
          first: 12
          orderBy: date_DESC
          ${page > 1 ? `skip: ${(page - 1) * 12}` : ""}
        ) {
          ${preview}
        }
        _allArticlesMeta(filter: {subject: {eq: $subject}}) {
          count
        }
      }
    `,
    variables: {subject},
  })
}

export async function loadSubjectSlugs(subject: Subject) {
  let page = 1
  const {
    allArticles,
    _allArticlesMeta: {count},
  } = await loadSubjectSlugsPage({page, subject})
  let slugs = allArticles.map(({slug}) => slug)
  while (page * 100 < count) {
    page++
    const {allArticles: newArticles} = await loadSubjectSlugsPage({
      page,
      subject,
    })
    slugs = [...slugs, ...newArticles.map(({slug}) => slug)]
  }
  return slugs
}

function loadSubjectSlugsPage({
  page,
  subject,
}: {
  page: number
  subject: Subject
}) {
  return makeDatoRequest<{
    allArticles: Array<Pick<Article, "slug">>
    _allArticlesMeta: {count: number}
  }>({
    query: `
        query GetSubjectArticles($subject: String!) {
          allArticles(
            filter: {subject: {eq: $subject}}
            first: 100
            orderBy: date_DESC
            ${page > 1 ? `skip: ${(page - 1) * 100}` : ""}
          ) {
            slug
          }
          ${
            page === 1
              ? "_allArticlesMeta(filter: {subject: {eq: $subject}}) {count}"
              : ""
          }
        }
      `,
    variables: {subject},
  })
}

async function makeDatoRequest<T>({
  includeDrafts = process.env.NODE_ENV === "development",
  query,
  revalidate = 3600,
  variables = {},
}: {
  includeDrafts?: boolean
  query: string
  revalidate?: number
  variables?: object
}): Promise<T> {
  const response = await fetch("https://graphql.datocms.com/", {
    body: JSON.stringify({query, variables}),
    headers: {
      Authorization: `Bearer ${process.env.NEXT_DATOCMS_API_TOKEN}`,
      ...(includeDrafts && {"X-Include-Drafts": "true"}),
    },
    method: "POST",
    ...(revalidate && {next: {revalidate}}),
  })
  const responseBody = await response.json()
  if (!response.ok) {
    throw Error(
      `${response.status} ${response.statusText}: ${JSON.stringify(
        responseBody,
      )}`,
    )
  }
  return responseBody.data
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
