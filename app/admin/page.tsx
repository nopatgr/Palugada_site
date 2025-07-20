"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdmin } from "@/contexts/admin-context"
import { useToast } from "@/components/ui/toast"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated } = useAdmin()
  const { addToast } = useToast()

  useEffect(() => {
    // Check for access key in URL
    const accessKey = searchParams.get("access_key")
    if (accessKey === "dp2024admin") {
      setAccessGranted(true)
    }

    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const success = await login(email, password)

    if (success) {
      addToast({
        type: "success",
        title: "Login Successful",
        description: "Welcome to the admin dashboard!",
      })
      router.push("/admin/dashboard")
    } else {
      addToast({
        type: "error",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      })
    }

    setIsLoading(false)
  }

  // Show access denied if no proper access key
  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-slate-900 border-slate-700">
          <CardContent className="p-8 text-center">
            <Lock className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-slate-400">
              This page requires special access. Please use the correct URL with access key.
            </p>
            <p className="text-xs text-slate-500 mt-4">Hint: /admin?access_key=dp2024admin</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <p className="text-slate-400">DigitalPro Dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-300">
                <Mail className="inline h-4 w-4 mr-2" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="admin@digitalpro.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-300">
                <Lock className="inline h-4 w-4 mr-2" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">Demo Credentials:</p>
            <p className="text-xs text-slate-300">Email: admin@digitalpro.com</p>
            <p className="text-xs text-slate-300">Password: admin123!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
