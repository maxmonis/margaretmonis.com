import {Article} from "@/types"
import makeDatoRequest from "../makeDatoRequest"

export default function loadArticle(slug: string) {
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
