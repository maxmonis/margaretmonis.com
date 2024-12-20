import {subjects} from "@/constants"
import loadSubjectArticleCount from "@/datocms/queries/loadSubjectArticleCount"
import loadSubjectArticles from "@/datocms/queries/loadSubjectArticles"
import {SubjectProps} from "@/types"
import {getSubjectText} from "@/utils/parsers"
import {isSubject} from "@/utils/validators"
import {Metadata} from "next"
import React from "react"

export default function SubjectLayout({children}: React.PropsWithChildren) {
  return children
}

export async function generateMetadata(props: SubjectProps) {
  const {subject, ...params} = await props.params
  const page = parseInt(params.page)
  if (page && isSubject(subject)) {
    const {allArticles} = await loadSubjectArticles({page, subject})
    if (allArticles.length) {
      const title = getSubjectText(subject)
      const metadata: Metadata = {
        description: `${title} - Articles by Margaret Monis`,
        openGraph: {images: [allArticles[0].image]},
        title,
      }
      return metadata
    }
  }
}

export async function generateStaticParams() {
  const params: Array<Awaited<SubjectProps["params"]>> = []
  for (const subject of subjects) {
    const count = await loadSubjectArticleCount(subject)
    let page = 0
    while (page * 12 < count) {
      page++
      params.push({page: page.toString(), subject})
    }
  }
  return params
}

export const dynamicParams = false
