import {makeDatoRequest} from "@/shared/functions"
import {Article, Subject} from "../types"

export function loadArticle(variables: {slug: string; subject: Subject}) {
  return makeDatoRequest<Omit<Article, "blurb">>({
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
