import {DatoImage} from "../shared/types"
import {subjects} from "./constants"

export type Subject = (typeof subjects)[number]

export type SubjectProps = {
  params: {subject: string}
}

export type Article = {
  blurb: string
  date: string
  image: Omit<DatoImage, "id">
  slug: string
  subject: Subject
  text: string
  title: string
}

export type SubjectResponse = Array<Omit<Article, "text">>
