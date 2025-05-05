"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Info, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BadgesPage() {
  const [assignedClasses, setAssignedClasses] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [availableBadges, setAvailableBadges] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBadge, setSelectedBadge] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [badgeNote, setBadgeNote] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Fetch assigned classes for the guide
  const fetchAssignedClasses = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch classes")
      const guideId = localStorage.getItem("userId")
      const filteredClasses = Array.isArray(data) ? data : data.classes || []
      const matchedClasses = filteredClasses.filter((cls) =>
        cls.assignedGuides?.some((guide: any) =>
          guide.toString() === guideId || parseInt(guide) === parseInt(guideId)
        )
      )
      setAssignedClasses(matchedClasses)
    } catch (err: any) {
      setError(err.message)
      setAssignedClasses([])
    }
  }

  // Fetch available badges
  const fetchAvailableBadges = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/awards", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch badges")
      const badges = Array.isArray(data) ? data : data.awards || []
      setAvailableBadges(badges)
      return badges
    } catch (err: any) {
      setError(err.message)
      return []
    }
  }

  // Fetch students for the selected class and associate badges
  const fetchStudents = async (classId: string) => {
    try {
      const token = localStorage.getItem("token")
      const [studentsResponse, awards] = await Promise.all([
        fetch(`https://education-system-backend-gray.vercel.app/api/students?classId=${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetchAvailableBadges(),
      ])

      const studentsData = await studentsResponse.json()
      if (!studentsResponse.ok) throw new Error(studentsData.message || "Failed to fetch students")

      const studentsList = Array.isArray(studentsData) ? studentsData : studentsData.students || []
      console.log("Students List:", studentsList) // Debug: Check student data
      console.log("Awards:", awards) // Debug: Check awards data

      // const studentsWithBadges = studentsList.map((student: any) => {
      //   const studentIdStr = student._id.toString().trim()
      //   const studentBadges = awards
      //     .filter((award: any) => award.studentsAwarded?.some((id: string) => id === studentIdStr))
      //     .map((award: any) => ({
      //       name: award.name,
      //       icon: award.icon || "🏅",
      //     }))
      //   console.log("Student ID:", studentIdStr, "Awarded IDs:", award.studentsAwarded, "Badges:", studentBadges) // Debug: Check badge mapping
      //   return {
      //     ...student,
      //     badges: studentBadges,
      //   }
      // })

       setStudents(studentsList)
      // console.log("Students with Badges:", studentsWithBadges) // Debug: Check final student data
    } catch (err: any) {
      setError(err.message)
      setStudents([])
    }
  }

  useEffect(() => {
    fetchAssignedClasses()
    fetchAvailableBadges()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass)
    } else {
      setStudents([])
    }
  }, [selectedClass])

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBadge || selectedStudents.length === 0) return

    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      const guideId= localStorage.getItem("userId")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/badge-awards", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guideId,
          awardId: selectedBadge,
          studentIds: selectedStudents,
          note: badgeNote,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to award badges")

      setIsSuccess(true)
      await fetchStudents(selectedClass)

      setTimeout(() => {
        setIsSuccess(false)
        setSelectedStudents([])
        setBadgeNote("")
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedBadgeInfo = availableBadges.find((badge) => badge._id === selectedBadge)
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6 md:ml-64 ml-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Award Badges</h1>
        <p className="text-muted-foreground">Recognize student achievements by awarding badges.</p>
      </div>

      {isSuccess && (
        <Alert className="bg-emerald-50 border-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-emerald-600">Badges Awarded Successfully</AlertTitle>
          <AlertDescription className="text-emerald-700">
            The selected badge has been awarded to {selectedStudents.length} student(s).
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <Info className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-600">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Award Badges to Students</CardTitle>
            <CardDescription>Select a badge and the students you want to award it to.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="badge">
                Select Badge <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedBadge} onValueChange={setSelectedBadge} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a badge" />
                </SelectTrigger>
                <SelectContent>
                  {availableBadges.map((badge) => (
                    <SelectItem key={badge._id} value={badge._id}>
                      <div className="flex items-center">
                        <span className="mr-2">{badge.icon || "🏅"}</span>
                        {badge.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBadgeInfo && (
              <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3">
                <div className="text-2xl">{selectedBadgeInfo.icon || "🏅"}</div>
                <div>
                  <h4 className="font-medium text-blue-700">{selectedBadgeInfo.name}</h4>
                  <p className="text-sm text-blue-600">{selectedBadgeInfo.description}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="class">
                Select Class <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedClass} onValueChange={setSelectedClass} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {assignedClasses.map((cls) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedClass && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="search">Students</Label>
                    <span className="text-sm text-muted-foreground">{selectedStudents.length} selected</span>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search students..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Select</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Current Badges</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student._id)}
                              onChange={() => handleStudentSelection(student._id)}
                              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {student.badges && student.badges.length > 0 ? (
                                student.badges.map((badge: any, index: number) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                                  >
                                    <span className="mr-1">{badge.icon}</span>
                                    {badge.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">No badges</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Input
                    id="note"
                    placeholder="Add a note about why this badge is being awarded..."
                    value={badgeNote}
                    onChange={(e) => setBadgeNote(e.target.value)}
                  />
                </div>

                <div className="bg-amber-50 p-4 rounded-md flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-700">Badge Award</h4>
                    <p className="text-sm text-amber-600">
                      Badges are a great way to recognize student achievements and encourage positive behavior.
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedBadge || selectedStudents.length === 0}>
              {isSubmitting ? "Awarding..." : "Award Badge"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}