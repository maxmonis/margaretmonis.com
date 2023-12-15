import {Article, Subject} from "../shared/types"

export function loadArticle(slug: string) {
  return makeDatoRequest<{article: Omit<Article, "blurb"> | null}>({
    query: `
      query GetArticle($slug: String!) {
        article(filter: {slug: {eq: $slug}}) ${getFields()}
      }
    `,
    variables: {slug},
  })
}

export function loadArticleList(slugs: Array<string>) {
  return makeDatoRequest<{allArticles: Array<Omit<Article, "text">>}>({
    query: `
        query GetSuggestedArticles($slugs: [String]!) {
          allArticles(
            filter: {slug: {in: $slugs}}
            orderBy: date_DESC
          ) ${getFields(true)}
        }
      `,
    variables: {slugs},
  })
}

export function loadRecentArticles() {
  return makeDatoRequest<{allArticles: Array<Omit<Article, "text">>}>({
    query: `
      query GetRecentArticles {
        allArticles(first: 3, orderBy: date_DESC) ${getFields(true)}
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
        ) ${getFields(true)}
        _allArticlesMeta(filter: {subject: {eq: $subject}}) {count}
      }
    `,
    variables: {subject},
  })
}

export async function loadSubjectArticleCount(subject: Subject) {
  const {
    _allArticlesMeta: {count},
  } = await makeDatoRequest<{_allArticlesMeta: {count: number}}>({
    query: `
      query GetSubjectArticleCount($subject: String!) {
        _allArticlesMeta(filter: {subject: {eq: $subject}}) {count}
      }
    `,
    variables: {subject},
  })
  return count
}

export async function loadSubjectSlugs(subject: Subject) {
  const {
    allArticles,
    _allArticlesMeta: {count},
  } = await loadSubjectSlugsPage({page: 1, subject})
  let slugs = allArticles.map(({slug}) => slug)
  let page = 1
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

function loadSubjectSlugsPage<
  Page extends number,
  Meta extends Page extends 1 ? {_allArticlesMeta: {count: number}} : {},
>({page, subject}: {page: Page; subject: Subject}) {
  return makeDatoRequest<
    {
      allArticles: Array<Pick<Article, "slug">>
    } & Meta
  >({
    query: `
        query GetSubjectArticles($subject: String!) {
          allArticles(
            filter: {subject: {eq: $subject}}
            first: 100
            orderBy: date_DESC
            ${page > 1 ? `skip: ${(page - 1) * 100}` : ""}
          ) {slug}
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
  variables = {},
}: {
  includeDrafts?: boolean
  query: string
  variables?: object
}): Promise<T> {
  const response = await fetch("https://graphql.datocms.com/", {
    body: JSON.stringify({query, variables}),
    headers: {
      Authorization: `Bearer ${process.env.NEXT_DATOCMS_API_TOKEN}`,
      ...(includeDrafts && {"X-Include-Drafts": "true"}),
    },
    method: "POST",
    next: {revalidate: 60 * 60 * 24},
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

function getFields(preview = false) {
  return `{
    date
    image {
      alt
      url${preview ? "(imgixParams: {fit: crop, h: 200, w: 200})" : ""}
    }
    slug
    subject
    title
    ${preview ? "blurb" : "text"}
  }`
}
