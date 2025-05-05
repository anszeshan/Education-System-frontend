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
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus, Search, Pencil, Trash2, AlertCircle } from 'lucide-react'
import Select from "react-select"
import { LayoutHeader } from "@/components/dashboard/layout-header"
import { Bar, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default function GuidesPage() {
  const [guides, setGuides] = useState([])
  const [classes, setClasses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentGuide, setCurrentGuide] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    assignedClasses: [] as string[],
  })

  const limit = 5 // Items per page

  // Fetch guides
  const fetchGuides = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://education-system-backend-gray.vercel.app/api/users?role=guide&search=${searchTerm}&page=${page}&limit=${limit}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch guides")
      setGuides(data.users || [])
      setTotalPages(Math.ceil((data.total || 0) / limit) || 1)
    } catch (err: any) {
      setError(err.message)
      setGuides([])
    }
  }

  // Fetch classes for dropdown
  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/classes", {
        headers: {
          "Authorization": `Bearer ${token}`,
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

  useEffect(() => {
    fetchClasses()
    fetchGuides()
  }, [searchTerm, page])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddGuide = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/users", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "guide",
          phone: formData.phone,
          classes: formData.assignedClasses,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to add guide")
      setFormData({ name: "", email: "", phone: "", password: "", assignedClasses: [] })
      setIsAddDialogOpen(false)
      fetchGuides()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEditGuide = async () => {
    if (!currentGuide) return
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/users/${currentGuide.userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          classes: formData.assignedClasses,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to update guide")
      setFormData({ name: "", email: "", phone: "", password: "", assignedClasses: [] })
      setIsEditDialogOpen(false)
      fetchGuides()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteGuide = async () => {
    if (!currentGuide) return
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/users/${currentGuide.userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to delete guide")
      setIsDeleteDialogOpen(false)
      fetchGuides()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const openEditDialog = (guide: any) => {
    setCurrentGuide(guide)
    setFormData({
      name: guide.name,
      email: guide.email,
      phone: guide.phone,
      password: "",
      assignedClasses: guide.classes ? guide.classes.map((c: any) => c._id) : [],
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (guide: any) => {
    setCurrentGuide(guide)
    setIsDeleteDialogOpen(true)
  }

  // Prepare options for react-select
  const classOptions = classes.map((classItem: any) => ({
    value: classItem._id,
    label: classItem.name,
  }))

  // Data for Bar Chart: Number of classes per guide
  const barChartData = {
    labels: guides.map((guide: any) => guide.name),
    datasets: [
      {
        label: "Number of Assigned Classes",
        data: guides.map((guide: any) => (guide.classes ? guide.classes.length : 0)),
        backgroundColor: "rgba(16, 185, 129, 0.6)", // Emerald-600
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Data for Pie Chart: Distribution of guides across classes
  const classCounts: { [key: string]: number } = {}
  classes.forEach((classItem: any) => {
    classCounts[classItem._id] = 0
  })
  guides.forEach((guide: any) => {
    if (guide.classes) {
      guide.classes.forEach((c: any) => {
        classCounts[c._id] = (classCounts[c._id] || 0) + 1
      })
    }
  })

  const pieChartData = {
    labels: classes.map((classItem: any) => classItem.name),
    datasets: [
      {
        label: "Guides per Class",
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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <LayoutHeader 
        title="Guides" 
        description="Manage guides and their assigned classes." 
      />

      <div className="flex justify-between items-center mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Guide
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Guide</DialogTitle>
              <DialogDescription>Enter the details of the new guide.</DialogDescription>
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
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="h-10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Set a password"
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="123-456-7890"
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignedClasses">Assigned Classes</Label>
                <Select
                  isMulti
                  options={classOptions}
                  value={classOptions.filter((option: any) => formData.assignedClasses.includes(option.value))}
                  onChange={(selectedOptions) =>
                    setFormData((prev) => ({
                      ...prev,
                      assignedClasses: selectedOptions.map((option: any) => option.value),
                    }))
                  }
                  placeholder="Select classes"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '40px',
                    }),
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddGuide}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
              >
                Add Guide
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guides..."
              className="pl-9 h-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Charts Section */}
        {guides.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Classes per Guide</h3>
              <div className="h-[300px]">
                <Bar
                  data={barChartData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: "Number of Classes Assigned to Each Guide",
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Guides Distribution by Class</h3>
              <div className="h-[300px]">
                <Pie
                  data={pieChartData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: "Distribution of Guides Across Classes",
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
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Assigned Classes</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guides.length > 0 ? (
                guides.map((guide: any) => (
                  <TableRow key={guide.userId} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{guide.name}</TableCell>
                    <TableCell>{guide.email}</TableCell>
                    <TableCell>{guide.phone || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {guide.classes && guide.classes.length > 0
                          ? guide.classes.map((c: any, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
                              >
                                {c.name}
                              </span>
                            ))
                          : "None"}
                      </div>
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
                          <DropdownMenuItem onClick={() => openEditDialog(guide)} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4 text-emerald-600" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(guide)} className="text-red-600 cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    No guides found.
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

      {/* Edit Guide Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Guide</DialogTitle>
            <DialogDescription>Update the guide's information.</DialogDescription>
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
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleChange} className="h-10" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" name="phone" value={formData.phone} onChange={handleChange} className="h-10" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-assignedClasses">Assigned Classes</Label>
              <Select
                isMulti
                options={classOptions}
                value={classOptions.filter((option: any) => formData.assignedClasses.includes(option.value))}
                onChange={(selectedOptions) =>
                  setFormData((prev) => ({
                    ...prev,
                    assignedClasses: selectedOptions.map((option: any) => option.value),
                  }))
                }
                placeholder="Select classes"
                className="basic-multi-select"
                classNamePrefix="select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '40px',
                  }),
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditGuide}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Guide Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Guide</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this guide? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 pb-2">
            {currentGuide && (
              <div className="p-4 rounded-lg bg-gray-50 mb-4">
                <p className="font-medium">{currentGuide.name}</p>
                <p className="text-sm text-gray-500">{currentGuide.email}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGuide}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}