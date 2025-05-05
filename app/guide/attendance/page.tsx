"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Info, Search } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("")
  const [assignedClasses, setAssignedClasses] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [sessionNotes, setSessionNotes] = useState("")
  const [attendanceData, setAttendanceData] = useState<Record<number, { present: boolean; notes: string }>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch assigned classes for the authenticated guide
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

  // Fetch students for the selected class
  const fetchStudents = async (classId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/students?classId=${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch students")

      const studentsList = (Array.isArray(data) ? data : data.students || []).map((student: any) => ({
        id: parseInt(student.studentId), // Map studentId to id as number
        name: student.name,
        class: student.classId,
      }))
      setStudents(studentsList)
    } catch (err: any) {
      setError(err.message)
      setStudents([])
    }
  }

  // Fetch classes on component mount
  useEffect(() => {
    fetchAssignedClasses()
  }, [])

  // Fetch students when a class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass)
    } else {
      setStudents([])
      setAttendanceData({})
    }
  }, [selectedClass])

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAttendanceChange = (studentId: number, present: boolean) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], present },
    }))
  }

  const handleNotesChange = (studentId: number, notes: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClass) return

    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/attendance", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: selectedClass,
          date,
          sessionNotes,
          attendance: attendanceData,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to record attendance")

      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Initialize attendance data when students are fetched or class changes
  const handleClassChange = (value: string) => {
    setSelectedClass(value)
    const initialAttendanceData: Record<number, { present: boolean; notes: string }> = {}
    students
      .filter((student) => student.class === value)
      .forEach((student) => {
        initialAttendanceData[student.id] = { present: true, notes: "" }
      })
    setAttendanceData(initialAttendanceData)
  }

  // Update attendance data whenever students list changes
  useEffect(() => {
    if (selectedClass) {
      const initialAttendanceData: Record<number, { present: boolean; notes: string }> = {}
      students
        .filter((student) => student.class === selectedClass)
        .forEach((student) => {
          initialAttendanceData[student.id] = attendanceData[student.id] || { present: true, notes: "" }
        })
      setAttendanceData(initialAttendanceData)
    }
  }, [students, selectedClass])

  return (
    <div className="p-6 space-y-6 md:ml-64 ml-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
        <p className="text-muted-foreground">Record student attendance and behavior notes.</p>
      </div>

      {isSuccess && (
        <Alert className="bg-emerald-50 border-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-emerald-600">Attendance Recorded Successfully</AlertTitle>
          <AlertDescription className="text-emerald-700">
            Attendance has been recorded for the selected class.
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
            <CardTitle>Attendance Details</CardTitle>
            <CardDescription>Select a class and mark attendance for each student.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="class">
                  Class <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedClass} onValueChange={handleClassChange} required>
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

              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>

            {selectedClass && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="search">Students</Label>
                    <span className="text-sm text-muted-foreground">
                      {Object.values(attendanceData).filter((data) => data.present).length} / {filteredStudents.length}{" "}
                      Present
                    </span>
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
                        <TableHead>Student Name</TableHead>
                        <TableHead className="w-[120px] text-center">Present</TableHead>
                        <TableHead>Behavior Notes (Optional)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Switch
                                checked={attendanceData[student.id]?.present ?? true}
                                onCheckedChange={(checked) => handleAttendanceChange(student.id, checked)}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Optional notes about behavior, participation, etc."
                              value={attendanceData[student.id]?.notes ?? ""}
                              onChange={(e) => handleNotesChange(student.id, e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionNotes">General Session Notes (Optional)</Label>
                  <Textarea
                    id="sessionNotes"
                    placeholder="Any general notes about the session..."
                    rows={3}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-700">Attendance Tracking</h4>
                    <p className="text-sm text-blue-600">
                      Mark students as present or absent and add optional behavior notes for each student.
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
            <Button type="submit" disabled={isSubmitting || !selectedClass}>
              {isSubmitting ? "Submitting..." : "Submit Attendance"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}