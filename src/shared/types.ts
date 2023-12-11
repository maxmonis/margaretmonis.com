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

export type Comment = {
  date: string
  id: string
  slug: string
  subject: Subject
  text: string
  user: User
}

export type Subject = (typeof subjects)[number]

export type User = {
  email: string
  name: string
  sid: string
}
