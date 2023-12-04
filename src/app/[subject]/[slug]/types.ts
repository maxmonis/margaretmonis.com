import {Subject} from "../types"

export type ArticleProps = {
  params: {
    slug: string
    subject: string
  }
}

export type Article = {
  blurb: string
  date: string
  image: {
    alt: string
    url: string
  }
  slug: string
  subject: Subject
  text: string
  title: string
}
