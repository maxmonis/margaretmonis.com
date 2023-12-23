import {Article, Subject} from "@/types"
import makeDatoRequest from "../makeDatoRequest"

/**
 * Loads all article slugs from a given subject
 */
export default async function loadSubjectSlugs(subject: Subject) {
  const {
    allArticles,
    _allArticlesMeta: {count},
  } = await loadSubjectSlugsPage({page: 1, subject})
  const slugs = allArticles.map(a => a.slug)
  let page = 1
  while (page * 100 < count) {
    page++
    const {allArticles: newArticles} = await loadSubjectSlugsPage({
      page,
      subject,
    })
    for (const {slug} of newArticles) {
      slugs.push(slug)
    }
  }
  return slugs
}

/**
 * Loads a page of slugs, containing up to 100 entries since
 * this is the maximum DatoCMS allows us to fetch at a time
 */
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
      query GetSubjectSlugs($subject: String!) {
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
