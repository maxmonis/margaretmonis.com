import {ArticlePreview, Subject} from "@/types"
import {articlePreview} from "../constants"
import {makeDatoRequest} from "../makeDatoRequest"

export function loadSubjectArticles({
  page,
  subject,
}: {
  page: number
  subject: Subject
}) {
  return makeDatoRequest<{
    allArticles: Array<ArticlePreview>
    _allArticlesMeta: {count: number}
  }>({
    query: `
      query GetSubjectArticles($subject: String!) {
        allArticles(
          filter: {subject: {eq: $subject}}
          first: 12
          orderBy: date_DESC
          ${page > 1 ? `skip: ${(page - 1) * 12}` : ""}
        ) ${articlePreview}
        _allArticlesMeta(filter: {subject: {eq: $subject}}) {count}
      }
    `,
    variables: {subject},
  })
}
