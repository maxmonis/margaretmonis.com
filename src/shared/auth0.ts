import {getSession} from "@auth0/nextjs-auth0"
import {User} from "./types"

export async function getUser() {
  const session = await getSession()
  return session?.user as User
}
