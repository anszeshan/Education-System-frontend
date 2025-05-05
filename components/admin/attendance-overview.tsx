"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Search, Users, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Line } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function AttendanceOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [timeRange, setTimeRange] = useState("month")
  const [classFilter, setClassFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [attendanceData, setAttendanceData] = useState([])
  const [summary, setSummary] = useState({
    totalClasses: 0,
    totalStudents: 0,
    averageAttendance: "0",
    trend: "stable",
  })
  const [trendData, setTrendData] = useState([])
  const [classes, setClasses] = useState([])
  const [error, setError] = useState<string | null>(null)
  const limit = 5

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

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token")
      const classQuery = classFilter && classFilter !== "all" ? `&classId=${classFilter}` : ""
      const response = await fetch(
        `https://education-system-backend-gray.vercel.app/api/attendance?search=${searchTerm}&page=${page}&limit=${limit}&timeRange=${timeRange}${classQuery}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch attendance data")
      setAttendanceData(data.attendanceData || [])
      setTotalPages(Math.ceil((data.total || 0) / limit) || 1)
    } catch (err: any) {
      setError(err.message)
      setAttendanceData([])
    }
  }

  // Fetch summary metrics
  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/attendance/summary?timeRange=${timeRange}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch summary")
      setSummary(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Fetch trend data for chart
  const fetchTrendData = async () => {
    try {
      const token = localStorage.getItem("token")
      const classQuery = classFilter && classFilter !== "all" ? `&classId=${classFilter}` : ""
      const response = await fetch(
        `https://education-system-backend-gray.vercel.app/api/attendance/trend?timeRange=${timeRange}${classQuery}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch trend data")
      setTrendData(data.trendData || [])
    } catch (err: any) {
      setError(err.message)
      setTrendData([])
    }
  }

  useEffect(() => {
    fetchClasses()
    fetchSummary()
    fetchTrendData()
  }, [timeRange, classFilter])

  useEffect(() => {
    fetchAttendance()
  }, [searchTerm, page, timeRange, classFilter])

  // Prepare chart data
  const chartData = {
    labels: trendData.map((item: any) => item.label),
    datasets: [
      {
        label: "Attendance Rate (%)",
        data: trendData.map((item: any) => item.attendanceRate),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
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
        text: "Attendance Trends",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Attendance Rate (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: timeRange === "week" ? "Day" : timeRange === "month" ? "Day" : timeRange === "quarter" ? "Week" : "Month",
        },
      },
    },
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg shadow-sm">
      {/* Summary Section */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Classes</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalClasses}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalStudents}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Attendance</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.averageAttendance}%</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overall Trend</CardTitle>
            {summary.trend === "up" && <TrendingUp className="h-5 w-5 text-green-500" />}
            {summary.trend === "down" && <TrendingDown className="h-5 w-5 text-red-500" />}
            {summary.trend === "stable" && <Minus className="h-5 w-5 text-gray-500" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{summary.trend}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search classes..."
            className="pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[180px] border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md">
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
      </div>

      {/* Chart Section */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Attendance Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {trendData.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No trend data available for the selected time range.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Attendance Details</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Total Students</TableHead>
                  <TableHead>Average Attendance</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.length > 0 ? (
                  attendanceData.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.class}</TableCell>
                      <TableCell>{item.totalStudents}</TableCell>
                      <TableCell>{item.averageAttendance}%</TableCell>
                      <TableCell>
                        {item.lastActivity
                          ? new Date(item.lastActivity).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {item.trend === "up" && (
                            <div className="text-green-500 flex items-center">
                              <TrendingUp className="h-5 w-5 mr-1" />
                              <span>Improving</span>
                            </div>
                          )}
                          {item.trend === "down" && (
                            <div className="text-red-500 flex items-center">
                              <TrendingDown className="h-5 w-5 mr-1" />
                              <span>Declining</span>
                            </div>
                          )}
                          {item.trend === "stable" && (
                            <div className="text-gray-500 flex items-center">
                              <Minus className="h-5 w-5 mr-1" />
                              <span>Stable</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 hover:bg-blue-50"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          View Students
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No attendance data found.
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
              className="border-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}