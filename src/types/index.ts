import {subjects} from "@/constants"
import {loadComments} from "@/firebase/comments"

export type Article = {
  blurb: string
  date: `${number}-${number}-${number}`
  image: {
    alt: string
    url: string
  }
  slug: string
  subject: Subject
  text: string
  title: string
}

export type ArticlePreview = Omit<Article, "text">

export type ArticleProps = {params: {slug: string}}

export type CommentArray = Awaited<ReturnType<typeof loadComments>>

export type Subject = (typeof subjects)[number]

export type SubjectProps = {params: {page: string; subject: string}}
