import {ArticlePreview} from "@/types"
import {articlePreview} from "../constants"
import makeDatoRequest from "../makeDatoRequest"

/**
 * Loads the article previews which match the slugs it receives
 */
export default function loadArticleList(slugs: Array<string>) {
  return makeDatoRequest<{allArticles: Array<ArticlePreview>}>({
    query: `
      query GetArticleList($slugs: [String]!) {
        allArticles(
          filter: {slug: {in: $slugs}}
          orderBy: date_DESC
        ) ${articlePreview}
      }
    `,
    variables: {slugs},
  })
}
