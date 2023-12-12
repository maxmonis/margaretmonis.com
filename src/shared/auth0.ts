import {getSession} from "@auth0/nextjs-auth0"
import {UserProfile} from "@auth0/nextjs-auth0/client"

export async function getUser() {
  const session = await getSession()
  return session ? (session.user as UserProfile) : null
}
