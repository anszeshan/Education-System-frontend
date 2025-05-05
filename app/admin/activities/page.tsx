"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import Select from "react-select"
import { Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LayoutHeader } from "@/components/dashboard/layout-header"
import { Pie, Bar, Bubble } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, Title, Tooltip, Legend)

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [guides, setGuides] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    eligibleClasses: [] as string[],
    assignedGuides: [] as string[],
  })

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token")
      const categoryQuery = categoryFilter !== "all" ? `&category=${categoryFilter}` : ""
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/activities?search=${searchTerm}${categoryQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch activities")
      setActivities(data)
    } catch (err: any) {
      setError(err.message)
      setActivities([])
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

  useEffect(() => {
    fetchClasses()
    fetchGuides()
  }, [])

  useEffect(() => {
    fetchActivities()
  }, [searchTerm, categoryFilter])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, selectedOptions: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions ? selectedOptions.map((option: any) => option.value) : [],
    }))
  }

  const handleAddActivity = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/activities", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          eligibleClasses: formData.eligibleClasses,
          assignedGuides: formData.assignedGuides,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to add activity")
      setFormData({
        name: "",
        description: "",
        category: "",
        eligibleClasses: [],
        assignedGuides: [],
      })
      setIsAddDialogOpen(false)
      fetchActivities()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEditActivity = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/activities/${currentActivity._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          eligibleClasses: formData.eligibleClasses,
          assignedGuides: formData.assignedGuides,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to update activity")
      setFormData({
        name: "",
        description: "",
        category: "",
        eligibleClasses: [],
        assignedGuides: [],
      })
      setIsEditDialogOpen(false)
      setCurrentActivity(null)
      fetchActivities()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteActivity = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/activities/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to delete activity")
      setIsDeleteDialogOpen(false)
      fetchActivities()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const openEditDialog = (activity: any) => {
    setCurrentActivity(activity)
    setFormData({
      name: activity.name,
      description: activity.description,
      category: activity.category,
      eligibleClasses: activity.eligibleClasses.map((cls: any) => cls._id),
      assignedGuides: activity.assignedGuides.map((guide: any) => guide._id),
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (activity: any) => {
    setCurrentActivity(activity)
    setIsDeleteDialogOpen(true)
  }

  const classOptions = classes.map((cls) => ({ value: cls._id, label: cls.name }))
  const guideOptions = guides.map((guide) => ({ value: guide._id, label: guide.name }))

  // Data for Pie Chart: Distribution of Activities by Category
  const categoryCounts = {
    academic: 0,
    creative: 0,
    physical: 0,
  }
  activities.forEach((activity: any) => {
    if (activity.category) {
      categoryCounts[activity.category as keyof typeof categoryCounts]++
    }
  })

  const pieChartData = {
    labels: ["Academic", "Creative", "Physical"],
    datasets: [
      {
        label: "Activities by Category",
        data: [categoryCounts.academic, categoryCounts.creative, categoryCounts.physical],
        backgroundColor: [
          "rgba(16, 185, 129, 0.6)", // Emerald-600
          "rgba(59, 130, 246, 0.6)", // Blue-500
          "rgba(244, 63, 94, 0.6)", // Rose-500
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(244, 63, 94, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Data for Bar Chart: Number of Activities per Class
  const classActivityCounts: { [key: string]: number } = {}
  classes.forEach((cls: any) => {
    classActivityCounts[cls._id] = 0
  })
  activities.forEach((activity: any) => {
    activity.eligibleClasses.forEach((cls: any) => {
      classActivityCounts[cls._id] = (classActivityCounts[cls._id] || 0) + 1
    })
  })

  const barChartData = {
    labels: classes.map((cls: any) => cls.name),
    datasets: [
      {
        label: "Number of Activities",
        data: classes.map((cls: any) => classActivityCounts[cls._id] || 0),
        backgroundColor: "rgba(16, 185, 129, 0.6)", // Emerald-600
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Data for Bubble Chart: Guides and Classes per Activity
  const bubbleChartData = {
    datasets: [
      {
        label: "Activities",
        data: activities.map((activity: any, index: number) => ({
          x: index + 1, // Activity index (1-based for clarity)
          y: activity.assignedGuides.length,
          r: Math.min(activity.eligibleClasses.length * 5, 30), // Bubble size based on class count
        })),
        backgroundColor: "rgba(16, 185, 129, 0.6)", // Emerald-600
        borderColor: "rgba(16, 185, 129, 1)",
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

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Activities",
        },
      },
    },
  }

  const bubbleChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        title: {
          display: true,
          text: "Activity Index",
        },
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Assigned Guides",
        },
      },
    },
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const activity = activities[context.dataIndex]
            return `${activity.name}: ${context.raw.y} Guides, ${context.raw.r / 5} Classes`
          },
        },
      },
    },
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <LayoutHeader title="Activities" description="Manage activity descriptions and assignments." />

      <div className="flex justify-between items-center mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
              <DialogDescription>Enter the details of the new activity.</DialogDescription>
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
                  placeholder="Math Workshop"
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Interactive workshop focusing on mathematical concepts"
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <ShadcnSelect
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                  </SelectContent>
                </ShadcnSelect>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eligibleClasses">Eligible Classes</Label>
                <Select
                  isMulti
                  options={classOptions}
                  value={classOptions.filter((option) => formData.eligibleClasses.includes(option.value))}
                  onChange={(selectedOptions) => handleSelectChange("eligibleClasses", selectedOptions)}
                  placeholder="Select classes"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "40px",
                    }),
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignedGuides">Assigned Guides</Label>
                <Select
                  isMulti
                  options={guideOptions}
                  value={guideOptions.filter((option) => formData.assignedGuides.includes(option.value))}
                  onChange={(selectedOptions) => handleSelectChange("assignedGuides", selectedOptions)}
                  placeholder="Select guides"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "40px",
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
                onClick={handleAddActivity}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
              >
                Add Activity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-9 h-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="bg-white h-10">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Charts Section */}
      {activities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Activities by Category</h3>
            <div className="h-[250px]">
              <Pie
                data={pieChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: "Distribution of Activities by Category",
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Activities per Class</h3>
            <div className="h-[250px]">
              <Bar
                data={barChartData}
                options={{
                  ...barChartOptions,
                  plugins: {
                    ...barChartOptions.plugins,
                    title: {
                      display: true,
                      text: "Number of Activities Assigned to Each Class",
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Guides and Classes per Activity</h3>
            <div className="h-[250px]">
              <Bubble
                data={bubbleChartData}
                options={{
                  ...bubbleChartOptions,
                  plugins: {
                    ...bubbleChartOptions.plugins,
                    title: {
                      display: true,
                      text: "Guides and Classes per Activity (Bubble Size = Classes)",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}

      <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="space-y-4">
        <TabsList className="bg-white border p-1 rounded-lg">
          <TabsTrigger
            value="all"
            className="rounded-md data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
          >
            All Activities
          </TabsTrigger>
          <TabsTrigger
            value="academic"
            className="rounded-md data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
          >
            Academic
          </TabsTrigger>
          <TabsTrigger
            value="creative"
            className="rounded-md data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
          >
            Creative
          </TabsTrigger>
          <TabsTrigger
            value="physical"
            className="rounded-md data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
          >
            Physical
          </TabsTrigger>
        </TabsList>

        {["all", "academic", "creative", "physical"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <Card className="border rounded-xl shadow-sm overflow-hidden">
              <CardContent className="p-0">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 m-4 rounded-md text-sm border border-red-200 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                <div>
                  <div className="grid grid-cols-12 p-4 text-sm font-medium text-muted-foreground bg-gray-50">
                    <div className="col-span-5">Description</div>
                    <div className="col-span-4">Eligible Classes</div>
                    <div className="col-span-2">Assigned Guides</div>
                    <div className="col-span-1"></div>
                  </div>

                  {activities.length > 0 ? (
                    activities.map((activity: any) => (
                      <div key={activity._id} className="grid grid-cols-12 p-4 border-t items-center hover:bg-gray-50">
                        <div className="col-span-5 truncate">{activity.description || activity.name}</div>
                        <div className="col-span-4 flex flex-wrap gap-1">
                          {activity.eligibleClasses.map((cls: any, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            >
                              {cls.name}
                            </Badge>
                          ))}
                        </div>
                        <div className="col-span-2 flex flex-wrap gap-1">
                          {activity.assignedGuides.map((guide: any, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-teal-50 text-teal-700 hover:bg-teal-100"
                            >
                              {guide.name}
                            </Badge>
                          ))}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => openEditDialog(activity)} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4 text-emerald-600" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(activity)}
                                className="text-red-600 cursor-pointer"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">No activities found.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Activity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>Update the details of the activity.</DialogDescription>
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
                placeholder="Math Workshop"
                className="h-10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Interactive workshop focusing on mathematical concepts"
                className="h-10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <ShadcnSelect
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                </SelectContent>
              </ShadcnSelect>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eligibleClasses">Eligible Classes</Label>
              <Select
                isMulti
                options={classOptions}
                value={classOptions.filter((option) => formData.eligibleClasses.includes(option.value))}
                onChange={(selectedOptions) => handleSelectChange("eligibleClasses", selectedOptions)}
                placeholder="Select classes"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "40px",
                  }),
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignedGuides">Assigned Guides</Label>
              <Select
                isMulti
                options={guideOptions}
                value={guideOptions.filter((option) => formData.assignedGuides.includes(option.value))}
                onChange={(selectedOptions) => handleSelectChange("assignedGuides", selectedOptions)}
                placeholder="Select guides"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "40px",
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
              onClick={handleEditActivity}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Activity Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 pb-2">
            {currentActivity && (
              <div className="p-4 rounded-lg bg-gray-50 mb-4">
                <p className="font-medium">{currentActivity.name}</p>
                <p className="text-sm text-gray-500">{currentActivity.description}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteActivity(currentActivity?._id)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}