import {subjects} from "@/constants"
import loadSubjectArticleCount from "@/datocms/queries/loadSubjectArticleCount"
import loadSubjectArticles from "@/datocms/queries/loadSubjectArticles"
import getSubjectText from "@/functions/getSubjectText"
import isSubject from "@/functions/isSubject"
import {SubjectProps} from "@/types"
import {Metadata} from "next"
import React from "react"

export default function SubjectLayout(props: React.PropsWithChildren) {
  return props.children
}

export async function generateMetadata({
  params: {subject, ...params},
}: SubjectProps) {
  const page = parseInt(params.page)
  if (page && isSubject(subject)) {
    const {allArticles} = await loadSubjectArticles({page, subject})
    if (allArticles.length) {
      const title = getSubjectText(subject)
      const metadata: Metadata = {
        description: `${title} - Articles by Margaret Monis`,
        openGraph: {
          images: [allArticles[0].image],
        },
        title,
      }
      return metadata
    }
  }
}

export async function generateStaticParams() {
  const params: Array<SubjectProps["params"]> = []
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
