"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BookOpen, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "guide"

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent, role: string) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store the JWT token
      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.user._id)
      // Redirect based on the API response
      router.push(data.redirect)
    } catch (error: any) {
      setError(error.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Decorative Panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-8 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-90 transition-opacity">
            <BookOpen className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold">Attendly</span>
          </Link>

          <div className="mt-24">
            <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
            <p className="text-xl opacity-90 mb-8 max-w-md">
              Sign in to access your dashboard and continue managing your educational activities with ease.
            </p>
            <div className="flex flex-col gap-6 max-w-md">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 rounded-full p-2 mt-1">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Track Attendance</h3>
                  <p className="opacity-80">Easily mark attendance and add behavior notes for each session.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 rounded-full p-2 mt-1">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Log Activities</h3>
                  <p className="opacity-80">Record class activities, topics, and notes with our intuitive interface.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 rounded-full p-2 mt-1">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Generate Reports</h3>
                  <p className="opacity-80">Access detailed analytics and reports to track student progress.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-12">
          <p className="text-sm opacity-80">© {new Date().getFullYear()} Attendly. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Attendly
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-center">Welcome Back!</h1>
            <p className="text-gray-600 text-center mt-2">Sign in to continue to your dashboard</p>
          </div>

          {/* Back to Home Link (Mobile) */}
          <div className="md:hidden mb-6">
            <Link href="/" className="text-gray-600 hover:text-emerald-600 flex items-center gap-1 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {/* Back to Home Link (Desktop) */}
          <div className="hidden md:block mb-8">
            <Link href="/" className="text-gray-600 hover:text-emerald-600 flex items-center gap-1 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <Tabs defaultValue={defaultRole} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8 bg-gray-100">
              <TabsTrigger
                value="guide"
                className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
              >
                Guide
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
              >
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guide">
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Guide Login</CardTitle>
                  <CardDescription>Sign in to access your guide dashboard and manage your classes.</CardDescription>
                </CardHeader>
                <form onSubmit={(e) => handleSubmit(e, "guide")}>
                  <CardContent className="space-y-5">
                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">{error}</div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="guide-email" className="text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="guide-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="guide-password" className="text-gray-700">
                          Password
                        </Label>
                        <Link href="/auth/forgot-password" className="text-xs text-emerald-600 hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="guide-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="h-11"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4 pt-2">
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                    <div className="text-center text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link href="/auth/register?role=guide" className="text-emerald-600 hover:underline font-medium">
                        Sign up
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Admin Login</CardTitle>
                  <CardDescription>Sign in to access the admin dashboard and manage the entire system.</CardDescription>
                </CardHeader>
                <form onSubmit={(e) => handleSubmit(e, "admin")}>
                  <CardContent className="space-y-5">
                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">{error}</div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="admin-email" className="text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="admin-email"
                        name="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="admin-password" className="text-gray-700">
                          Password
                        </Label>
                        <Link href="/auth/forgot-password" className="text-xs text-emerald-600 hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="admin-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="h-11"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4 pt-2">
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                    <div className="text-center text-sm text-gray-500">
                      Admin access is restricted. Contact your system administrator if you need access.
                    </div>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Security Note */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p className="flex items-center justify-center gap-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              Secure login - Your connection to Attendly is encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
