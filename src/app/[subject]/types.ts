import {subjects} from "./constants"

export type Subject = (typeof subjects)[number]

export type SubjectProps = {
  params: {subject: string}
}
