import {subjects} from "./constants"

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

export type Subject = (typeof subjects)[number]
