import {Article} from "@/types"
import makeDatoRequest from "../makeDatoRequest"

/**
 * Loads the article (if any) which matches a slug
 */
export default function loadArticle(slug: string) {
  return makeDatoRequest<{article: Omit<Article, "blurb"> | null}>({
    query: `
      query GetArticle($slug: String!) {
        article(filter: {slug: {eq: $slug}}) {
          date
          image {
            alt
            url(imgixParams: {fit: crop, h: 768, w: 768})
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
