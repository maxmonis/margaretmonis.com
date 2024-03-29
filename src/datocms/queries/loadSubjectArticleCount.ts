import {Subject} from "@/types"
import makeDatoRequest from "../makeDatoRequest"

/**
 * Loads the total number of articles within a subject
 */
export default async function loadSubjectArticleCount(subject: Subject) {
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
