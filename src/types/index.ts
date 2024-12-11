import {subjects} from "@/constants"

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

export type ArticleProps = {params: Promise<{slug: string}>}

export type Subject = (typeof subjects)[number]

export type SubjectProps = {params: Promise<{page: string; subject: string}>}
