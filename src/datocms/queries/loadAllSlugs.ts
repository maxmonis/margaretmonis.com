import {Article} from "@/types"
import makeDatoRequest from "../makeDatoRequest"

/**
 * Loads the slugs of all articles in the CMS
 */
export default async function loadAllSlugs() {
  const {
    allArticles,
    _allArticlesMeta: {count},
  } = await loadSlugsPage(1)
  const slugs = allArticles.map(a => a.slug)
  let page = 1
  while (page * 100 < count) {
    page++
    const {allArticles: newArticles} = await loadSlugsPage(page)
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
function loadSlugsPage<
  Page extends number,
  Meta extends Page extends 1 ? {_allArticlesMeta: {count: number}} : {},
>(page: Page) {
  return makeDatoRequest<
    {
      allArticles: Array<Pick<Article, "slug">>
    } & Meta
  >({
    query: `
      query GetAllSlugs {
        allArticles(
          first: 100
          ${page > 1 ? `skip: ${(page - 1) * 100}` : ""}
        ) {slug}
        ${page === 1 ? "_allArticlesMeta {count}" : ""}
      }
    `,
  })
}
