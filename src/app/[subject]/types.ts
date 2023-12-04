import {subjects} from "./constants"

export type Subject = (typeof subjects)[number]

export type SubjectProps = {
  params: {subject: string}
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
