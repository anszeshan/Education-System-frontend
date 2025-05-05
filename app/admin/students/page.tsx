"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  Pencil,
  Trash2,
  Award,
  AlertCircle,
} from "lucide-react"
import { LayoutHeader } from "@/components/dashboard/layout-header"
import { Doughnut, Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement)

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [awards, setAwards] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    notes: "",
  })
  const [selectedBadge, setSelectedBadge] = useState("")

  const limit = 5

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token")
      const classQuery = classFilter && classFilter !== "all" ? `&classId=${classFilter}` : ""
      const response = await fetch(
        `https://education-system-backend-gray.vercel.app/api/students?search=${searchTerm}${classQuery}&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch students")
      setStudents(data.students || [])
      setTotalPages(Math.ceil((data.total || 0) / limit) || 1)
    } catch (err: any) {
      //setError(err.message)
      setStudents([])
    }
  }

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch classes")
      setClasses(data || [])
    } catch (err: any) {
      setError(err.message)
      setClasses([])
    }
  }

  const fetchAwards = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/awards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch awards")
      setAwards(Array.isArray(data.awards) ? data.awards : [])
    } catch (err: any) {
      setError(err.message)
      setAwards([])
    }
  }

  useEffect(() => {
    fetchClasses()
    fetchAwards()
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [searchTerm, classFilter, page])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddStudent = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/students", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          classId: formData.class,
          notes: formData.notes,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to add student")
      setFormData({ name: "", class: "", notes: "" })
      setIsAddDialogOpen(false)
      fetchStudents()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEditStudent = async () => {
    if (!currentStudent) return
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/students/${currentStudent._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          classId: formData.class,
          notes: formData.notes,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to update student")
      setFormData({ name: "", class: "", notes: "" })
      setIsEditDialogOpen(false)
      fetchStudents()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteStudent = async () => {
    if (!currentStudent) return
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/students/${currentStudent._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to delete student")
      setIsDeleteDialogOpen(false)
      fetchStudents()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleAwardBadge = async () => {
    if (!currentStudent || !selectedBadge) return
    try {
      const token = localStorage.getItem("token")
      const award = awards.find((a: any) => a.name === selectedBadge)
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/students/award-badge", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: currentStudent._id,
          badgeId: award._id,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to award badge")
      setSelectedBadge("")
      setIsAwardDialogOpen(false)
      fetchStudents()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const openEditDialog = (student: any) => {
    setCurrentStudent(student)
    setFormData({
      name: student.name,
      class: student.classId?._id || "",
      notes: student.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (student: any) => {
    setCurrentStudent(student)
    setIsDeleteDialogOpen(true)
  }

  const openAwardDialog = (student: any) => {
    setCurrentStudent(student)
    setIsAwardDialogOpen(true)
  }

  // Data for Doughnut Chart: Students per class
  const classCounts: { [key: string]: number } = {}
  classes.forEach((classItem: any) => {
    classCounts[classItem._id] = 0
  })
  students.forEach((student: any) => {
    if (student.classId?._id) {
      classCounts[student.classId._id] = (classCounts[student.classId._id] || 0) + 1
    }
  })

  const doughnutChartData = {
    labels: classes.map((classItem: any) => classItem.name),
    datasets: [
      {
        label: "Students per Class",
        data: classes.map((classItem: any) => classCounts[classItem._id] || 0),
        backgroundColor: [
          "rgba(16, 185, 129, 0.6)", // Emerald-600
          "rgba(20, 184, 166, 0.6)", // Teal-500
          "rgba(59, 130, 246, 0.6)", // Blue-500
          "rgba(244, 63, 94, 0.6)", // Rose-500
          "rgba(234, 179, 8, 0.6)", // Yellow-500
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(20, 184, 166, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(244, 63, 94, 1)",
          "rgba(234, 179, 8, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Data for Horizontal Bar Chart: Number of badges awarded
  const badgeCounts: { [key: string]: number } = {}
  awards.forEach((award: any) => {
    badgeCounts[award.name] = 0
  })
  students.forEach((student: any) => {
    if (student.awards) {
      student.awards.forEach((award: any) => {
        badgeCounts[award.name] = (badgeCounts[award.name] || 0) + 1
      })
    }
  })

  const horizontalBarChartData = {
    labels: awards.map((award: any) => award.name),
    datasets: [
      {
        label: "Number of Badges Awarded",
        data: awards.map((award: any) => badgeCounts[award.name] || 0),
        backgroundColor: "rgba(16, 185, 129, 0.6)", // Emerald-600
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Data for Line Chart: Average attendance rate per class
  const attendanceRates: { [key: string]: number[] } = {}
  classes.forEach((classItem: any) => {
    attendanceRates[classItem._id] = []
  })
  students.forEach((student: any) => {
    if (student.classId?._id && student.attendanceRecords?.length) {
      const rate =
        (student.attendanceRecords.filter((r: any) => r.status === "present").length /
          student.attendanceRecords.length) *
        100
      attendanceRates[student.classId._id].push(rate)
    }
  })

  const avgAttendanceRates = classes.map((classItem: any) => {
    const rates = attendanceRates[classItem._id]
    return rates.length ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length : 0
  })

  const lineChartData = {
    labels: classes.map((classItem: any) => classItem.name),
    datasets: [
      {
        label: "Average Attendance Rate (%)",
        data: avgAttendanceRates,
        fill: false,
        borderColor: "rgba(16, 185, 129, 1)", // Emerald-600
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "",
      },
    },
  }

  const horizontalBarOptions = {
    ...chartOptions,
    indexAxis: "y" as const,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Badges",
        },
      },
    },
  }

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Attendance Rate (%)",
        },
      },
    },
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <LayoutHeader title="Students" description="Manage students, their classes, and awards." />

      <div className="flex justify-between items-center mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Enter the details of the new student.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alex Johnson"
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="class">Class</Label>
                <Select value={formData.class} onValueChange={(value) => handleSelectChange("class", value)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem: any) => (
                      <SelectItem key={classItem._id} value={classItem._id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Student notes"
                  className="h-10"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddStudent}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
              >
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-9 h-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[180px] h-10 bg-white">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((classItem: any) => (
                <SelectItem key={classItem._id} value={classItem._id}>
                  {classItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Charts Section */}
        {students.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Students per Class</h3>
              <div className="h-[250px]">
                <Doughnut
                  data={doughnutChartData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: "Distribution of Students Across Classes",
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Badges Awarded</h3>
              <div className="h-[250px]">
                <Bar
                  data={horizontalBarChartData}
                  options={{
                    ...horizontalBarOptions,
                    plugins: {
                      ...horizontalBarOptions.plugins,
                      title: {
                        display: true,
                        text: "Number of Badges Awarded by Type",
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Average Attendance Rate</h3>
              <div className="h-[250px]">
                <Line
                  data={lineChartData}
                  options={{
                    ...lineChartOptions,
                    plugins: {
                      ...lineChartOptions.plugins,
                      title: {
                        display: true,
                        text: "Average Attendance Rate per Class",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Class</TableHead>
                <TableHead className="font-semibold">Attendance Rate</TableHead>
                <TableHead className="font-semibold">Badges</TableHead>
                <TableHead className="font-semibold">Notes</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length > 0 ? (
                students.map((student: any) => {
                  const className = student.classId?.name || "N/A"
                  const attendanceRate = student.attendanceRecords?.length
                    ? `${Math.round(
                        (student.attendanceRecords.filter((r: any) => r.status === "present").length /
                          student.attendanceRecords.length) *
                          100,
                      )}%`
                    : "N/A"
                  return (
                    <TableRow key={student._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{className}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              attendanceRate !== "N/A" && Number.parseInt(attendanceRate) > 80
                                ? "bg-emerald-500"
                                : attendanceRate !== "N/A" && Number.parseInt(attendanceRate) > 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          {attendanceRate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.awards && student.awards.length > 0 ? (
                            student.awards.map((award: any, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                              >
                                {award.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">No badges</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={student.notes}>
                        {student.notes || "N/A"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => openEditDialog(student)} className="cursor-pointer">
                              <Pencil className="mr-2 h-4 w-4 text-emerald-600" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openAwardDialog(student)} className="cursor-pointer">
                              <Award className="mr-2 h-4 w-4 text-amber-500" />
                              <span>Award Badge</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(student)}
                              className="text-red-600 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update the student's information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleChange} className="h-10" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-class">Class</Label>
              <Select value={formData.class} onValueChange={(value) => handleSelectChange("class", value)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem: any) => (
                    <SelectItem key={classItem._id} value={classItem._id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input id="edit-notes" name="notes" value={formData.notes} onChange={handleChange} className="h-10" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditStudent}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Student Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this student? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 pb-2">
            {currentStudent && (
              <div className="p-4 rounded-lg bg-gray-50 mb-4">
                <p className="font-medium">{currentStudent.name}</p>
                <p className="text-sm text-gray-500">{currentStudent.classId?.name || "No class assigned"}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Award Badge Dialog */}
      <Dialog open={isAwardDialogOpen} onOpenChange={setIsAwardDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Award Badge</DialogTitle>
            <DialogDescription>Select a badge to award to {currentStudent?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            {awards.length > 0 ? (
              <Select value={selectedBadge} onValueChange={setSelectedBadge}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a badge" />
                </SelectTrigger>
                <SelectContent>
                  {awards.map((badge: any) => (
                    <SelectItem key={badge._id} value={badge.name}>
                      {badge.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-muted-foreground">No awards available to select.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAwardDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAwardBadge}
              disabled={!selectedBadge}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
            >
              Award Badge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}