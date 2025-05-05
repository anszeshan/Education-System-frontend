"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BookOpen, Eye, EyeOff, ArrowLeft, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "guide"

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Check password requirements
    if (name === "password") {
      setPasswordValidation({
        minLength: value.length >= 8,
        hasUppercase: /[A-Z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Check if password meets all requirements
    const { minLength, hasUppercase, hasNumber, hasSpecial } = passwordValidation
    if (!(minLength && hasUppercase && hasNumber && hasSpecial)) {
      setError("Password does not meet all requirements")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role, // Using the role from URL params
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Store the JWT token
      localStorage.setItem("token", data.token)

      // Redirect based on the API response
      router.push(data.redirect || `/${role}/dashboard`)
    } catch (error: any) {
      setError(error.message || "An error occurred during registration")
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
            <h1 className="text-4xl font-bold mb-6">Join Attendly Today</h1>
            <p className="text-xl opacity-90 mb-8 max-w-md">
              Create your account to start managing educational activities and tracking student progress with ease.
            </p>
            <div className="flex flex-col gap-6 max-w-md">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 rounded-full p-2 mt-1">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Streamlined Workflow</h3>
                  <p className="opacity-80">
                    Simplify your daily tasks with our intuitive interface designed for educators.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 rounded-full p-2 mt-1">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Comprehensive Reporting</h3>
                  <p className="opacity-80">
                    Generate detailed reports on attendance, activities, and student progress.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 rounded-full p-2 mt-1">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Secure & Reliable</h3>
                  <p className="opacity-80">
                    Your data is protected with enterprise-grade security and regular backups.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-12">
          <p className="text-sm opacity-80">© {new Date().getFullYear()} Attendly. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
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
            <h1 className="text-2xl font-bold text-center">Create Your Account</h1>
            <p className="text-gray-600 text-center mt-2">Join thousands of educators using Attendly</p>
          </div>

          {/* Back to Home Link */}
          <div className="mb-8">
            <Link href="/" className="text-gray-600 hover:text-emerald-600 flex items-center gap-1 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">{role === "admin" ? "Admin" : "Guide"} Registration</CardTitle>
              <CardDescription>
                Create an account to start managing your {role === "admin" ? "school" : "classes"} and activities.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
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
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
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

                  {/* Password requirements */}
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500 mb-1">Password requirements:</p>
                    <div className="grid grid-cols-2 gap-1">
                      <div
                        className={`text-xs flex items-center gap-1 ${passwordValidation.minLength ? "text-emerald-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.minLength ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <span className="h-3 w-3 rounded-full border border-current" />
                        )}
                        At least 8 characters
                      </div>
                      <div
                        className={`text-xs flex items-center gap-1 ${passwordValidation.hasUppercase ? "text-emerald-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.hasUppercase ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <span className="h-3 w-3 rounded-full border border-current" />
                        )}
                        Uppercase letter
                      </div>
                      <div
                        className={`text-xs flex items-center gap-1 ${passwordValidation.hasNumber ? "text-emerald-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.hasNumber ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <span className="h-3 w-3 rounded-full border border-current" />
                        )}
                        Number
                      </div>
                      <div
                        className={`text-xs flex items-center gap-1 ${passwordValidation.hasSpecial ? "text-emerald-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.hasSpecial ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <span className="h-3 w-3 rounded-full border border-current" />
                        )}
                        Special character
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
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
                  {/* Password match indicator */}
                  {formData.confirmPassword && (
                    <div
                      className={`text-xs flex items-center gap-1 mt-1 ${
                        formData.password === formData.confirmPassword ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <Check className="h-3 w-3" />
                          Passwords match
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          Passwords don't match
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Terms and conditions */}
                <div className="flex items-start gap-2 mt-2">
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-emerald-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-emerald-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href={`/auth/login?role=${role}`} className="text-emerald-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>

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
              Secure registration - Your connection to Attendly is encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
