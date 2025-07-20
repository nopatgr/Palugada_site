"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authService, type AdminUser } from "@/lib/auth"

interface AdminContextType {
  user: AdminUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken()
      if (token) {
        const user = await authService.verifyToken(token)
        setUser(user)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const user = await authService.authenticate(email, password)
      if (user) {
        const token = await authService.generateToken(user)
        authService.storeToken(token)
        setUser(user)
        setIsLoading(false)
        return true
      }
      setIsLoading(false)
      return false
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    authService.removeToken()
    setUser(null)
  }

  return (
    <AdminContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
