import {makeDatoRequest} from "@/shared/functions"
import {Article, Subject} from "../types"

export function loadArticle({slug, subject}: {slug: string; subject: Subject}) {
  return makeDatoRequest<Omit<Article, "blurb">>({
    query: `
      query GetArticle {
        article(filter: {slug: {eq: "${slug}"}, subject: {eq: "${subject}"}}) {
          date
          image {
            alt
            height
            title
            width
            url
          }
          slug
          subject
          text
          title
        }
      }
    `,
  })
}
