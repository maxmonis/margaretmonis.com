"use client"
import {auth} from "@/firebase/client"
import {onAuthStateChanged, User} from "firebase/auth"
import React from "react"

const AuthContext = React.createContext<{loading: boolean; user: User | null}>({
  loading: true,
  user: null,
})

export const useAuth = () => React.useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  const unsubscribe = onAuthStateChanged(auth, user => {
    setUser(user)
    setLoading(false)
  })

  React.useEffect(() => {
    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{loading, user}}>
      {children}
    </AuthContext.Provider>
  )
}
