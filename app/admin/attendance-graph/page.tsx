"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Download, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { format, addMonths, subMonths, eachDayOfInterval, startOfMonth, endOfMonth, addDays } from "date-fns"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function AttendanceGraphPage() {
  const [currentDate, setCurrentDate] = useState(new Date("2025-05-01"))
  const [selectedClass, setSelectedClass] = useState("all-classes")
  const [classes, setClasses] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("weekly")
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] })
  const [summary, setSummary] = useState({ averageAttendance: 0, perfectAttendance: 0, absentStudents: 0, aiConfidence: 0 })
  const [rawData, setRawData] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any[]>([])
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [useDummyData, setUseDummyData] = useState(true)

  // Dummy Data
  const dummyClasses = [
    { _id: "class1", name: "Math 101" },
    { _id: "class2", name: "Science 102" },
    { _id: "class3", name: "History 103" },
  ]

  const dummyAttendanceData = {
    weekly: {
      chartData: [
        { label: "May 1", value: 85.0 },
        { label: "May 2", value: 90.0 },
        { label: "May 3", value: 75.0 },
        { label: "May 4", value: 88.0 },
        { label: "May 5", value: 92.0 },
        { label: "May 6", value: 80.0 },
        { label: "May 7", value: 87.0 },
      ],
      summary: {
        averageAttendance: 85.3,
        perfectAttendance: 5,
        absentStudents: 3,
        aiConfidence: 0.85,
      },
      rawData: [
        { day: "May 1", rate: 85.0, present: 17, total: 20 },
        { day: "May 2", rate: 90.0, present: 18, total: 20 },
        { day: "May 3", rate: 75.0, present: 15, total: 20 },
        { day: "May 4", rate: 88.0, present: 17, total: 20 },
        { day: "May 5", rate: 92.0, present: 18, total: 20 },
        { day: "May 6", rate: 80.0, present: 16, total: 20 },
        { day: "May 7", rate: 87.0, present: 17, total: 20 },
      ],
    },
    monthly: {
      chartData: Array.from({ length: 31 }, (_, i) => ({
        label: `May ${i + 1}`,
        value: 70 + Math.random() * 25,
      })),
      rawData: Array.from({ length: 31 }, (_, i) => ({
        day: `May ${i + 1}`,
        rate: 70 + Math.random() * 25,
        present: Math.floor(15 + Math.random() * 5),
        total: 20,
      })),
    },
    yearly: {
      chartData: [
        { label: "Jan", value: 82.0 },
        { label: "Feb", value: 85.0 },
        { label: "Mar", value: 88.0 },
        { label: "Apr", value: 90.0 },
        { label: "May", value: 87.0 },
        { label: "Jun", value: 85.0 },
        { label: "Jul", value: 80.0 },
        { label: "Aug", value: 83.0 },
        { label: "Sep", value: 88.0 },
        { label: "Oct", value: 90.0 },
        { label: "Nov", value: 85.0 },
        { label: "Dec", value: 87.0 },
      ],
    },
    comparison: {
      chartData: [
        { label: "Math 101", value: 85.0 },
        { label: "Science 102", value: 90.0 },
        { label: "History 103", value: 80.0 },
      ],
    },
  }

  const dummyStudents = [
    { id: "student1", name: "John Doe", class: "Math 101", status: "present", notes: "On time" },
    { id: "student2", name: "Jane Smith", class: "Math 101", status: "absent", notes: "Sick" },
    { id: "student3", name: "Alice Johnson", class: "Math 101", status: "present", notes: "Active participation" },
    { id: "student4", name: "Bob Brown", class: "Math 101", status: "excused", notes: "School event" },
    { id: "student5", name: "Emma Davis", class: "Math 101", status: "present", notes: "" },
  ]

  const dummyPredictions = {
    predictions: [
      { label: "May 8", value: 88.0 },
      { label: "May 9", value: 86.5 },
      { label: "May 10", value: 89.0 },
      { label: "May 11", value: 87.5 },
      { label: "May 12", value: 90.0 },
      { label: "May 13", value: 88.5 },
      { label: "May 14", value: 87.0 },
    ],
    anomalies: [
      { day: "May 3", rate: "75.0", isAnomaly: true },
    ],
  }

  // Fetch classes
  const fetchClasses = async () => {
    if (useDummyData) {
      setClasses(dummyClasses)
      return
    }
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/classes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch classes")
      setClasses(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Fetch attendance graph data
  const fetchAttendanceData = async () => {
    setLoading(true)
    if (useDummyData) {
      const data = dummyAttendanceData[activeTab as keyof typeof dummyAttendanceData]
      const chartConfig = {
        labels: data.chartData.map((d: any) => d.label),
        datasets:
          activeTab === "comparison"
            ? [
                {
                  label: "Present (%)",
                  data: data.chartData.map((d: any) => d.value),
                  backgroundColor: "rgba(34, 197, 94, 0.5)",
                  borderColor: "rgba(34, 197, 94, 1)",
                  stack: "Stack 0",
                },
                {
                  label: "Absent (%)",
                  data: data.chartData.map((d: any) => 100 - d.value),
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  stack: "Stack 0",
                },
              ]
            : [
                {
                  label: "Attendance Rate (%)",
                  data: data.chartData.map((d: any) => d.value),
                  borderColor: "rgba(0, 0, 0, 1)",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  fill: true,
                  tension: 0.4,
                },
              ],
      }
      setChartData(chartConfig)
      setSummary(data.summary || { averageAttendance: 0, perfectAttendance: 0, absentStudents: 0, aiConfidence: 0 })
      setRawData(data.rawData || [])
      setLoading(false)
      return
    }
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://education-system-backend-gray.vercel.app/api/reports/attendance-graph?period=${activeTab}&date=${currentDate.toISOString()}&classId=${selectedClass}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch attendance data")

      const chartConfig = {
        labels: data.chartData.map((d: any) => d.label),
        datasets:
          activeTab === "comparison"
            ? [
                {
                  label: "Present (%)",
                  data: data.chartData.map((d: any) => d.value),
                  backgroundColor: "rgba(34, 197, 94, 0.5)",
                  borderColor: "rgba(34, 197, 94, 1)",
                  stack: "Stack 0",
                },
                {
                  label: "Absent (%)",
                  data: data.chartData.map((d: any) => 100 - d.value),
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  stack: "Stack 0",
                },
              ]
            : [
                {
                  label: "Attendance Rate (%)",
                  data: data.chartData.map((d: any) => d.value),
                  borderColor: "rgba(0, 0, 0, 1)",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  fill: true,
                  tension: 0.4,
                },
              ],
      }
      setChartData(chartConfig)
      setSummary(data.summary || { averageAttendance: 0, perfectAttendance: 0, absentStudents: 0, aiConfidence: 0 })
      setRawData(data.rawData || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch student data
  const fetchStudents = async () => {
    if (useDummyData) {
      setStudents(
        selectedClass === "all-classes"
          ? dummyStudents
          : dummyStudents.filter((s) => s.class === dummyClasses.find((c) => c._id === selectedClass)?.name)
      )
      return
    }
    try {
      const token = localStorage.getItem("token")
      const query = selectedClass === "all-classes" ? "" : `classId=${selectedClass}`
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/reports/students?${query}&date=${currentDate.toISOString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch students")
      setStudents(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Fetch AI predictions and anomalies
  const fetchPredictions = async () => {
    if (useDummyData) {
      setPredictions(dummyPredictions.predictions)
      setAnomalies(dummyPredictions.anomalies)
      setSummary((prev) => ({ ...prev, aiConfidence: 0.85 }))
      return
    }
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://education-system-backend-gray.vercel.app/api/reports/attendance-predictions?date=${currentDate.toISOString()}&classId=${selectedClass}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch predictions")
      setPredictions(data.predictions || [])
      setAnomalies(data.anomalies || [])
      setSummary((prev) => ({ ...prev, aiConfidence: 0.85 }))
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchClasses()
    fetchAttendanceData()
    fetchStudents()
    fetchPredictions()
  }, [activeTab, currentDate, selectedClass, useDummyData])

  // Date navigation
  const handlePrevPeriod = () => setCurrentDate((prev) => subMonths(prev, 1))
  const handleNextPeriod = () => setCurrentDate((prev) => addMonths(prev, 1))

  // Export data as CSV
  const handleExportData = () => {
    if (!rawData.length && !students.length) return

    const csvContent = activeTab === "weekly" ? exportWeeklyData() : exportStudentData()
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance_${activeTab}_${format(currentDate, "yyyy-MM")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportWeeklyData = () => {
    const headers = ["Day", "Attendance Rate (%)", "Present Students", "Total Students"]
    const csvRows = [
      headers.join(","),
      ...rawData.map((row: any) => [row.day, row.rate.toFixed(1), row.present, row.total].join(",")),
    ]
    return csvRows.join("\n")
  }

  const exportStudentData = () => {
    const headers = ["Student ID", "Name", "Class", "Status", "Notes"]
    const csvRows = [
      headers.join(","),
      ...students.map((student: any) =>
        [
          student.id,
          `"${student.name}"`,
          `"${student.class}"`,
          student.status,
          `"${student.notes}"`,
        ].join(",")
      ),
    ]
    return csvRows.join("\n")
  }

  // Heatmap data for monthly tab
  const heatmapData = () => {
    const days = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) })
    const rates = rawData.map((d: any) => d.rate || 0)
    return {
      labels: days.map((d) => format(d, "d")),
      datasets: [
        {
          label: "Attendance Rate (%)",
          data: rates,
          backgroundColor: rates.map((rate: number) =>
            rate > 80 ? "rgba(34, 197, 94, 0.8)" : rate > 50 ? "rgba(255, 206, 86, 0.8)" : "rgba(255, 99, 132, 0.8)"
          ),
        },
      ],
    }
  }

  // Prediction chart data
  const predictionChartData = {
    labels: predictions.map((p: any) => p.label),
    datasets: [
      {
        label: "Predicted Attendance Rate (%)",
        data: predictions.map((p: any) => p.value),
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { enabled: true },
      title: {
        display: true,
        text:
          activeTab === "weekly"
            ? "Weekly Attendance Trends"
            : activeTab === "monthly"
            ? "Monthly Attendance Patterns"
            : activeTab === "yearly"
            ? "Yearly Attendance Overview"
            : "Class Attendance Comparison",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "Attendance Rate (%)" },
      },
      x: {
        title: {
          display: true,
          text:
            activeTab === "weekly"
              ? "Day"
              : activeTab === "monthly"
              ? "Day"
              : activeTab === "yearly"
              ? "Month"
              : "Class",
        },
      },
    },
  }

  const heatmapOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Monthly Attendance Heatmap" },
    },
    scales: {
      y: { display: false },
      x: { title: { display: true, text: "Day of Month" } },
    },
  }

  const predictionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Predicted Attendance (Next 7 Days)" },
    },
    scales: {
      y: { beginAtZero: true, max: 100, title: { display: true, text: "Predicted Rate (%)" } },
      x: { title: { display: true, text: "Day" } },
    },
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Attendance Analytics</h1>
          <p className="text-gray-500">Analyze attendance trends and predict future patterns with AI insights.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setUseDummyData(!useDummyData)}
            variant="outline"
            className="border-gray-300"
          >
            {useDummyData ? "Use Real Data" : "Use Dummy Data"}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevPeriod} className="border-gray-300">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <DatePicker
              selected={currentDate}
              onChange={(date: Date) => setCurrentDate(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="border-gray-300 bg-white rounded-md px-3 py-2 text-sm"
            />
            <Button variant="outline" size="icon" onClick={handleNextPeriod} className="border-gray-300">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleExportData}
            disabled={!rawData.length && !students.length}
            className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white p-4 rounded-lg shadow-sm">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[200px] border-gray-300 focus:ring-2 focus:ring-black rounded-md">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-classes">All Classes</SelectItem>
            {classes.map((cls: any) => (
              <SelectItem key={cls._id} value={cls._id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error and Anomalies */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}
      {anomalies.length > 0 && (
        <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm border border-yellow-200 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Anomalies detected: {anomalies.map((a) => `${a.day} (${a.rate}%)`).join(", ")}
        </div>
      )}

      {/* Tabs and Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="weekly" className="rounded-md">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-md">Monthly</TabsTrigger>
          <TabsTrigger value="yearly" className="rounded-md">Yearly</TabsTrigger>
          <TabsTrigger value="comparison" className="rounded-md">Comparison</TabsTrigger>
          <TabsTrigger value="predictions" className="rounded-md">AI Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Weekly Attendance Trends</CardTitle>
              <CardDescription>Daily attendance rates for the selected week</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center text-gray-500">Loading...</div>
              ) : chartData.labels.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
              )}
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-l-4 border-l-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-600">Average Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{summary.averageAttendance}%</div>
                <p className="text-sm text-gray-500">Weekly average</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-600">Perfect Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{summary.perfectAttendance}</div>
                <p className="text-sm text-gray-500">Students with 100% attendance</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-600">Absent Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{summary.absentStudents}</div>
                <p className="text-sm text-gray-500">On the last day</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-600">AI Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{(summary.aiConfidence * 100).toFixed(0)}%</div>
                <p className="text-sm text-gray-500">Prediction reliability</p>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Student Attendance</CardTitle>
              <CardDescription>Attendance records for students in the selected class</CardDescription>
            </CardHeader>
            <CardContent>
              {students.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.status}</TableCell>
                        <TableCell>{student.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-gray-500">No students found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Monthly Attendance Heatmap</CardTitle>
              <CardDescription>Attendance intensity by day for the selected month</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center text-gray-500">Loading...</div>
              ) : rawData.length > 0 ? (
                <Bar data={heatmapData()} options={heatmapOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
              )}
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Student Attendance</CardTitle>
              <CardDescription>Attendance records for students in the selected class</CardDescription>
            </CardHeader>
            <CardContent>
              {students.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.status}</TableCell>
                        <TableCell>{student.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-gray-500">No students found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Yearly Attendance Trends</CardTitle>
              <CardDescription>Monthly attendance rates for the selected year</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center text-gray-500">Loading...</div>
              ) : chartData.labels.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Class Attendance Comparison</CardTitle>
              <CardDescription>Compare attendance rates across classes</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center text-gray-500">Loading...</div>
              ) : chartData.labels.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>AI-Predicted Attendance</CardTitle>
              <CardDescription>Forecasted attendance rates for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center text-gray-500">Loading...</div>
              ) : predictions.length > 0 ? (
                <Bar data={predictionChartData} options={predictionChartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">No predictions available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}