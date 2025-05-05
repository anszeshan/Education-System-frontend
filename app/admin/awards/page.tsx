"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Plus, Search, Trash2, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bar, Line } from "react-chartjs-2"
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
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

export default function AwardsPage() {
  const [awards, setAwards] = useState([])
  const [allAwards, setAllAwards] = useState([]) // For charts
  const [studentsWithAwards, setStudentsWithAwards] = useState([])
  const [classes, setClasses] = useState([]) // For class-based charts
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewStudentsDialogOpen, setIsViewStudentsDialogOpen] = useState(false)
  const [currentAward, setCurrentAward] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    criteria: "",
    icon: "",
  })

  const limit = 6 // Show 6 awards per page for the grid layout

  const fetchAwards = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://education-system-backend-gray.vercel.app/api/awards?search=${searchTerm}&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch awards")
      setAwards(data.awards)
      setTotalPages(Math.ceil(data.total / limit))
    } catch (err: any) {
      setError(err.message)
      setAwards([])
    }
  }

  const fetchAllAwards = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/awards?search=${searchTerm}&all=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch all awards")
      setAllAwards(data.awards)
    } catch (err: any) {
      setError(err.message)
      setAllAwards([])
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

  const fetchStudentsForAward = async (awardId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/awards/${awardId}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch students")
      setStudentsWithAwards(data)
    } catch (err: any) {
      setError(err.message)
      setStudentsWithAwards([])
    }
  }

  useEffect(() => {
    fetchAwards()
    fetchAllAwards()
    fetchClasses()
  }, [searchTerm, page])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddAward = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/awards", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to add award")
      setFormData({
        name: "",
        description: "",
        criteria: "",
        icon: "",
      })
      setIsAddDialogOpen(false)
      fetchAwards()
      fetchAllAwards()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEditAward = async () => {
    if (!currentAward) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/awards/${currentAward.awardId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to update award")
      setIsEditDialogOpen(false)
      fetchAwards()
      fetchAllAwards()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteAward = async () => {
    if (!currentAward) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/awards/${currentAward.awardId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to delete award")
      setIsDeleteDialogOpen(false)
      fetchAwards()
      fetchAllAwards()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const openEditDialog = (award: any) => {
    setCurrentAward(award)
    setFormData({
      name: award.name,
      description: award.description,
      criteria: award.criteria,
      icon: award.icon,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (award: any) => {
    setCurrentAward(award)
    setIsDeleteDialogOpen(true)
  }

  const openViewStudentsDialog = async (award: any) => {
    setCurrentAward(award)
    await fetchStudentsForAward(award.awardId)
    setIsViewStudentsDialogOpen(true)
  }

  // Data for Bar Chart: Number of Students per Award
  const barChartData = {
    labels: allAwards.map((award: any) => award.name),
    datasets: [
      {
        label: "Students Awarded",
        data: allAwards.map((award: any) => award.studentsAwarded?.length || 0),
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Black with opacity
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Data for Grouped Bar Chart: Awards per Class
  const classAwardCounts: { [key: string]: number } = {}
  classes.forEach((cls: any) => {
    classAwardCounts[cls._id] = 0
  })
  allAwards.forEach((award: any) => {
    award.studentsAwarded?.forEach((student: any) => {
      if (student.classId) {
        classAwardCounts[student.classId] = (classAwardCounts[student.classId] || 0) + 1
      }
    })
  })

  const groupedBarChartData = {
    labels: classes.map((cls: any) => cls.name || "Unknown"),
    datasets: [
      {
        label: "Awards Given",
        data: classes.map((cls: any) => classAwardCounts[cls._id] || 0),
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Black with opacity
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Data for Line Chart: Awards Over Time (by Month)
  const awardDates = allAwards
    .flatMap((award: any) =>
      award.studentsAwarded?.map((student: any) => new Date(student.awardedDate || Date.now())),
    )
    .filter((date: Date) => date)
  const months = Array.from(
    new Set(
      awardDates.map((date: Date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`),
    ),
  ).sort()
  const awardsByMonth = months.map((month: string) => {
    const count = awardDates.filter(
      (date: Date) =>
        `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}` === month,
    ).length
    return count
  })

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "Awards Given",
        data: awardsByMonth,
        fill: false,
        borderColor: "rgba(0, 0, 0, 1)", // Black
        backgroundColor: "rgba(0, 0, 0, 0.6)", // For points
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

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Students",
        },
      },
    },
  }

  const groupedBarChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Awards",
        },
      },
    },
  }

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Awards",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Awards</h1>
          <p className="text-muted-foreground">Manage awards and recognize student achievements.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Award
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Award</DialogTitle>
              <DialogDescription>Create a new award to recognize student achievements.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-4 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="🏆"
                    className="text-center text-2xl"
                  />
                </div>
                <div className="grid gap-2 col-span-3">
                  <Label htmlFor="name">Award Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Perfect Attendance"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this award recognizes..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="criteria">Award Criteria</Label>
                <Input
                  id="criteria"
                  name="criteria"
                  value={formData.criteria}
                  onChange={handleChange}
                  placeholder="100% attendance for one month"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-black hover:bg-gray-800 text-white" onClick={handleAddAward}>
                Add Award
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search awards..."
              className="pl-8 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        {/* Charts Section */}
        {allAwards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Students per Award</h3>
              <div className="h-[250px]">
                <Bar
                  data={barChartData}
                  options={{
                    ...barChartOptions,
                    plugins: {
                      ...barChartOptions.plugins,
                      title: {
                        display: true,
                        text: "Number of Students per Award",
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Awards per Class</h3>
              <div className="h-[250px]">
                <Bar
                  data={groupedBarChartData}
                  options={{
                    ...groupedBarChartOptions,
                    plugins: {
                      ...groupedBarChartOptions.plugins,
                      title: {
                        display: true,
                        text: "Number of Awards per Class",
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Awards Over Time</h3>
              <div className="h-[250px]">
                <Line
                  data={lineChartData}
                  options={{
                    ...lineChartOptions,
                    plugins: {
                      ...lineChartOptions.plugins,
                      title: {
                        display: true,
                        text: "Awards Given by Month",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {awards.length > 0 ? (
            awards.map((award: any) => (
              <Card
                key={award.awardId}
                className="overflow-hidden border-2 border-gray-100 hover:border-gray-200 transition-all"
              >
                <CardHeader className="bg-gray-50 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="text-3xl">{award.icon}</div>
                      <CardTitle>{award.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewStudentsDialog(award)}>
                          <Users className="mr-2 h-4 w-4" />
                          View Students
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(award)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(award)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="mt-2">{award.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Criteria:</span>
                      <span>{award.criteria}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Students Awarded:</span>
                      <Badge variant="outline" className="bg-black text-white hover:bg-gray-800">
                        {award.studentsAwarded?.length || 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 p-8 text-center text-muted-foreground bg-gray-50 rounded-lg">
              No awards found. Create your first award to get started.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Edit Award Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Award</DialogTitle>
            <DialogDescription>Update the award information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}
            <div className="grid grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-icon">Icon</Label>
                <Input
                  id="edit-icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="text-center text-2xl"
                />
              </div>
              <div className="grid gap-2 col-span-3">
                <Label htmlFor="edit-name">Award Name</Label>
                <Input id="edit-name" name="name" value={formData.name} onChange={handleChange} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-criteria">Award Criteria</Label>
              <Input id="edit-criteria" name="criteria" value={formData.criteria} onChange={handleChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-black hover:bg-gray-800 text-white" onClick={handleEditAward}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Award Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Award</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this award? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAward}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Students Dialog */}
      <Dialog open={isViewStudentsDialogOpen} onOpenChange={setIsViewStudentsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Students with {currentAward?.name}</DialogTitle>
            <DialogDescription>View all students who have received this award.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}
            {studentsWithAwards.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Date Awarded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsWithAwards.map((student: any) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        {classes.find((cls: any) => cls._id === student.classId)?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {new Date(student.awardedDate || Date.now()).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center text-muted-foreground bg-gray-50 rounded-lg">
                No students have received this award yet.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              className="bg-black hover:bg-gray-800 text-white"
              onClick={() => setIsViewStudentsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}