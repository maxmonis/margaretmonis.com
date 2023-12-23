import {ArticlePreview} from "@/types"
import {articlePreview} from "../constants"
import {makeDatoRequest} from "../makeDatoRequest"

export function loadRecentArticles() {
  return makeDatoRequest<{allArticles: Array<ArticlePreview>}>({
    query: `
      query GetRecentArticles {
        allArticles(first: 3, orderBy: date_DESC) ${articlePreview}
      }
    `,
  })
}
