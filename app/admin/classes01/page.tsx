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
import { Checkbox } from "@/components/ui/checkbox"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  AlertCircle,
} from "lucide-react"
import { LayoutHeader } from "@/components/dashboard/layout-header"

export default function ClassesPage() {
  const [allClasses, setAllClasses] = useState<any[]>([]) // Store all classes
  const [classes, setClasses] = useState<any[]>([]) // Store paginated classes
  const [guides, setGuides] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewStudentsDialogOpen, setIsViewStudentsDialogOpen] = useState(false)
  const [currentClass, setCurrentClass] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    assignedGuides: [] as string[],
    activities: [] as string[],
  })

  const limit = 5

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/classes?search=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch classes")
      setAllClasses(data || [])
    } catch (err: any) {
      setError(err.message)
      setAllClasses([])
    }
  }

  const fetchGuides = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/users?role=guide", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch guides")
      setGuides(data.users || [])
    } catch (err: any) {
      setError(err.message)
      setGuides([])
    }
  }

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/activities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch activities")
      setActivities(data || [])
    } catch (err: any) {
      setError(err.message)
      setActivities([])
    }
  }

  const fetchStudentsForClass = async (classId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/students?classId=${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch students")
      setStudents(data.students || [])
    } catch (err: any) {
      setError(err.message)
      setStudents([])
    }
  }

  // Handle client-side pagination
  useEffect(() => {
    fetchClasses()
    fetchGuides()
    fetchActivities()
  }, [searchTerm])

  useEffect(() => {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    setClasses(allClasses.slice(startIndex, endIndex))
    setTotalPages(Math.ceil(allClasses.length / limit) || 1)
  }, [allClasses, page])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMultiSelectChange = (name: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentValues = prev[name as keyof typeof formData] as string[]
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] }
      } else {
        return { ...prev, [name]: currentValues.filter((v) => v !== value) }
      }
    })
  }

  const handleAddClass = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/classes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          assignedGuides: formData.assignedGuides,
          activities: formData.activities,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to add class")
      setFormData({ name: "", assignedGuides: [], activities: [] })
      setIsAddDialogOpen(false)
      fetchClasses()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEditClass = async () => {
    if (!currentClass) return
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/classes/${currentClass._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          assignedGuides: formData.assignedGuides,
          activities: formData.activities,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to update class")
      setFormData({ name: "", assignedGuides: [], activities: [] })
      setIsEditDialogOpen(false)
      fetchClasses()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteClass = async () => {
    if (!currentClass) return
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/classes/${currentClass._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to delete class")
      setIsDeleteDialogOpen(false)
      fetchClasses()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const openEditDialog = (cls: any) => {
    setCurrentClass(cls)
    setFormData({
      name: cls.name,
      assignedGuides: cls.assignedGuides.map((g: any) => g._id),
      activities: cls.activities.map((a: any) => a._id),
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (cls: any) => {
    setCurrentClass(cls)
    setIsDeleteDialogOpen(true)
  }

  const openViewStudentsDialog = async (cls: any) => {
    setCurrentClass(cls)
    await fetchStudentsForClass(cls._id)
    setIsViewStudentsDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <LayoutHeader title="Classes" description="Manage classes, assigned guides, and activities." />

      <div className="flex justify-between items-center mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>Enter the details of the new class.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="name">Class Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Class 5A"
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label>Assigned Guides</Label>
                <div className="max-h-40 overflow-y-auto p-3 border rounded-md bg-white">
                  {guides.length > 0 ? (
                    guides.map((guide: any) => (
                      <div key={guide._id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`guide-${guide._id}`}
                          checked={formData.assignedGuides.includes(guide._id)}
                          onCheckedChange={(checked) =>
                            handleMultiSelectChange("assignedGuides", guide._id, checked as boolean)
                          }
                        />
                        <Label htmlFor={`guide-${guide._id}`} className="cursor-pointer">
                          {guide.name}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No guides available</p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Activities</Label>
                <div className="max-h-40 overflow-y-auto p-3 border rounded-md bg-white">
                  {activities.length > 0 ? (
                    activities.map((activity: any) => (
                      <div key={activity._id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`activity-${activity._id}`}
                          checked={formData.activities.includes(activity._id)}
                          onCheckedChange={(checked) =>
                            handleMultiSelectChange("activities", activity._id, checked as boolean)
                          }
                        />
                        <Label htmlFor={`activity-${activity._id}`} className="cursor-pointer">
                          {activity.name}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No activities available</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddClass}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
              >
                Add Class
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
              placeholder="Search classes..."
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

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold">Class Name</TableHead>
                <TableHead className="font-semibold">Total Students</TableHead>
                <TableHead className="font-semibold">Registered Students</TableHead>
                <TableHead className="font-semibold">Assigned Guides</TableHead>
                <TableHead className="font-semibold">Activities</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.length > 0 ? (
                classes.map((cls: any) => (
                  <TableRow key={cls._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>{cls.totalStudents || 0}</TableCell>
                    <TableCell>{cls.students?.length || 0}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {cls.assignedGuides && cls.assignedGuides.length > 0 ? (
                          cls.assignedGuides.map((guide: any, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
                            >
                              {guide.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">No guides</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {cls.activities && cls.activities.length > 0 ? (
                          cls.activities.map((activity: any, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700"
                            >
                              {activity.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">No activities</span>
                        )}
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
                          <DropdownMenuItem onClick={() => openViewStudentsDialog(cls)} className="cursor-pointer">
                            <Users className="mr-2 h-4 w-4 text-blue-600" />
                            <span>View Students</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(cls)} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4 text-emerald-600" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(cls)}
                            className="text-red-600 cursor-pointer"
                          >
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
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No classes found.
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

      {/* Edit Class Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>Update the class information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Class Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleChange} className="h-10" />
            </div>
            <div className="grid gap-2">
              <Label>Assigned Guides</Label>
              <div className="max-h-40 overflow-y-auto p-3 border rounded-md bg-white">
                {guides.length > 0 ? (
                  guides.map((guide: any) => (
                    <div key={guide._id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`edit-guide-${guide._id}`}
                        checked={formData.assignedGuides.includes(guide._id)}
                        onCheckedChange={(checked) =>
                          handleMultiSelectChange("assignedGuides", guide._id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`edit-guide-${guide._id}`} className="cursor-pointer">
                        {guide.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No guides available</p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Activities</Label>
              <div className="max-h-40 overflow-y-auto p-3 border rounded-md bg-white">
                {activities.length > 0 ? (
                  activities.map((activity: any) => (
                    <div key={activity._id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`edit-activity-${activity._id}`}
                        checked={formData.activities.includes(activity._id)}
                        onCheckedChange={(checked) =>
                          handleMultiSelectChange("activities", activity._id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`edit-activity-${activity._id}`} className="cursor-pointer">
                        {activity.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No activities available</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditClass}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Class Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Class</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this class? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 pb-2">
            {currentClass && (
              <div className="p-4 rounded-lg bg-gray-50 mb-4">
                <p className="font-medium">{currentClass.name}</p>
                <p className="text-sm text-gray-500">
                  {currentClass.students?.length || 0} students, {currentClass.assignedGuides?.length || 0} guides
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteClass}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Students Dialog */}
      <Dialog open={isViewStudentsDialogOpen} onOpenChange={setIsViewStudentsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Students in {currentClass?.name}</DialogTitle>
            <DialogDescription>View all students assigned to this class.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            {students.length > 0 ? (
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Attendance Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student: any) => {
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
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8 bg-gray-50 rounded-lg">
                No students found in this class.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsViewStudentsDialogOpen(false)}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
