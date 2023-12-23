"use client"
import {auth} from "@/firebase"
import {onAuthStateChanged, User} from "firebase/auth"
import React from "react"

const AuthContext = React.createContext<{
  authenticating: boolean
  user: User | null
}>({
  authenticating: true,
  user: null,
})

export const useAuth = () => React.useContext(AuthContext)

export function AuthContextProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = React.useState<User | null>(null)
  const [authenticating, setAuthenticating] = React.useState(true)
  const unsubscribe = onAuthStateChanged(auth, user => {
    setUser(user)
    setAuthenticating(false)
  })
  React.useEffect(() => {
    return () => {
      unsubscribe()
    }
  }, [])
  return (
    <AuthContext.Provider value={{authenticating, user}}>
      {children}
    </AuthContext.Provider>
  )
}
