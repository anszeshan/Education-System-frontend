"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Users, School, UserCircle, Calendar, TrendingUp, ArrowUpRight } from "lucide-react"
import { RecentActivitiesTable } from "@/components/admin/recent-activities-table"
import { AttendanceOverview } from "@/components/admin/attendance-overview"
import { Button } from "@/components/ui/button"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { format, parseISO } from "date-fns"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalActivities: 0,
    totalStudents: 0,
    totalClasses: 0,
    totalGuides: 0,
    activityChange: 0,
    studentChange: 0,
  })
  const [weeklyActivities, setWeeklyActivities] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [studentPerformance, setStudentPerformance] = useState({ averageGrade: 0, topStudents: [] })
  const [guideActivity, setGuideActivity] = useState({ activeGuides: 0, totalSessions: 0 })
  const [systemHealth, setSystemHealth] = useState({ uptime: 0, errors: 0 })
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/dashboard/metrics", {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch metrics")
      setMetrics({
        totalActivities: data.totalActivities || 0,
        totalStudents: data.totalStudents || 0,
        totalClasses: data.totalClasses || 0,
        totalGuides: data.totalGuides || 0,
        activityChange: data.activityChange || 0,
        studentChange: data.studentChange || 0,
      })
    } catch (err: any) {
      setError(err.message)
    }
  }

  const fetchWeeklyActivities = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/dashboard/weekly-activities", {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch weekly activities")
      setWeeklyActivities(data.days || [])
    } catch (err: any) {
      setError(err.message)
      setWeeklyActivities([])
    }
  }

  const fetchUpcomingEvents = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://education-system-backend-gray.vercel.app/api/events?startDate=${new Date().toISOString()}&endDate=${new Date("2025-12-31").toISOString()}`,
        {
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch upcoming events")
      setUpcomingEvents(data.slice(0, 4)) // Limit to 4 upcoming events
    } catch (err: any) {
      setError(err.message)
      setUpcomingEvents([])
    }
  }

  const fetchStudentPerformance = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/dashboard/student-performance", {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch student performance")
      setStudentPerformance({ averageGrade: data.averageGrade || 0, topStudents: data.topStudents || [] })
    } catch (err: any) {
      setError(err.message)
      setStudentPerformance({ averageGrade: 0, topStudents: [] })
    }
  }

  const fetchGuideActivity = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/dashboard/guide-activity", {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch guide activity")
      setGuideActivity({ activeGuides: data.activeGuides || 0, totalSessions: data.totalSessions || 0 })
    } catch (err: any) {
      setError(err.message)
      setGuideActivity({ activeGuides: 0, totalSessions: 0 })
    }
  }

  const fetchSystemHealth = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/dashboard/system-health", {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch system health")
      setSystemHealth({ uptime: data.uptime || 0, errors: data.errors || 0 })
    } catch (err: any) {
      setError(err.message)
      setSystemHealth({ uptime: 0, errors: 0 })
    }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchMetrics(),
      fetchWeeklyActivities(),
      fetchUpcomingEvents(),
      fetchStudentPerformance(),
      fetchGuideActivity(),
      fetchSystemHealth(),
    ]).finally(() => setLoading(false))
  }, [selectedDate])

  const chartData = {
    labels: weeklyActivities.map((day: any) => new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })),
    datasets: [
      {
        label: "Activities",
        data: weeklyActivities.map((day: any) => day.count),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        barThickness: 20,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#ffffff", titleColor: "#1e293b", bodyColor: "#1e293b" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Activities" }, ticks: { color: "#64748b" } },
      x: { title: { display: true, text: "Days" }, ticks: { color: "#64748b" } },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-lg text-gray-600 mt-1">Comprehensive overview of school operations as of {selectedDate.toLocaleDateString()}</p>
          </div>
          <div className="flex gap-3">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              <TrendingUp className="mr-2 h-5 w-5" />
              Generate Report
            </Button> */}
          </div>
        </div>
      </header>

      {loading && <div className="text-center text-gray-600">Loading dashboard data...</div>}
      {error && <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>}

      {!loading && !error && (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Metrics</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between p-4 bg-emerald-50">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-6 w-6 text-emerald-600" />
                    <p className="text-md font-medium text-gray-700">Total Activities</p>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-md">
                    <Activity className="h-6 w-6 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-gray-900">{metrics.totalActivities}</div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-5 w-5 text-emerald-600 mr-1" />
                    <p className="text-sm text-emerald-600 font-medium">
                      {metrics.activityChange >= 0 ? `+${metrics.activityChange}%` : `${metrics.activityChange}%`} (Last Month)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between p-4 bg-blue-50">
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-blue-600" />
                    <p className="text-md font-medium text-gray-700">Total Students</p>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-md">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-gray-900">{metrics.totalStudents}</div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-5 w-5 text-emerald-600 mr-1" />
                    <p className="text-sm text-emerald-600 font-medium">
                      {metrics.studentChange >= 0 ? `+${metrics.studentChange}%` : `${metrics.studentChange}%`} (Last Month)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between p-4 bg-purple-50">
                  <div className="flex items-center space-x-3">
                    <School className="h-6 w-6 text-purple-600" />
                    <p className="text-md font-medium text-gray-700">Total Classes</p>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-md">
                    <School className="h-6 w-6 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-gray-900">{metrics.totalClasses}</div>
                  <p className="text-sm text-gray-600 mt-2">{metrics.totalClasses} active classes</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between p-4 bg-amber-50">
                  <div className="flex items-center space-x-3">
                    <UserCircle className="h-6 w-6 text-amber-600" />
                    <p className="text-md font-medium text-gray-700">Total Guides</p>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-md">
                    <UserCircle className="h-6 w-6 text-amber-600" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-gray-900">{metrics.totalGuides}</div>
                  <p className="text-sm text-gray-600 mt-2">{metrics.totalGuides} active guides</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="overview" className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                Overview
              </TabsTrigger>
              {/* <TabsTrigger value="activities" className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                Recent Activities
              </TabsTrigger> */}
              <TabsTrigger value="attendance" className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                Attendance
              </TabsTrigger>
              <TabsTrigger value="performance" className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                Student Performance
              </TabsTrigger>
              <TabsTrigger value="guides" className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                Guide Activity
              </TabsTrigger>
              <TabsTrigger value="system" className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                System Health
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-t-4 border-t-emerald-500 shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900">Weekly Activity Overview</CardTitle>
                    <CardDescription className="text-gray-600">Activities conducted per day this week</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 h-96">
                    {weeklyActivities.length > 0 ? (
                      <Bar data={chartData} options={chartOptions} />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-500">
                        No activity data available
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="border-t-4 border-t-blue-500 shadow-lg rounded-xl">
                              <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900">Upcoming Events</CardTitle>
                                <CardDescription className="text-gray-600">Next 4 scheduled events</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {upcomingEvents.length > 0 ? (
                                  upcomingEvents.map((event: any) => (
                                    <div
                                      key={event.eventId}
                                      className="p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                    >
                                      <h3 className="font-medium text-gray-800">{event.title}</h3>
                                      <div className="text-sm text-gray-600 mt-1">
                                        <p>
                                          {format(parseISO(event.date), "MMM d, yyyy")} • {event.startTime} - {event.endTime}
                                        </p>
                                        <p>{event.location || "TBD"}</p>
                                      </div>
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {event.classes?.map((cls: any) => (
                                          <span
                                            key={cls._id}
                                            className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full"
                                          >
                                            {cls.name}
                                          </span>
                                        ))}
                                      </div>
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {event.guides?.map((guide: any) => (
                                          <span
                                            key={guide._id}
                                            className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full"
                                          >
                                            {guide.name}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-gray-500 text-center">No upcoming events scheduled.</p>
                                )}
                                <Button variant="outline" className="w-full">
                                  View All Events
                                </Button>
                              </CardContent>
                            </Card>
                {/* <Card className="border-t-4 border-t-blue-500 shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900">Upcoming Events</CardTitle>
                    <CardDescription className="text-gray-600">Scheduled events for the next 7 days</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {upcomingEvents.length > 0 ? (
                        upcomingEvents.map((event: any) => (
                          <div
                            key={event._id}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="bg-blue-100 p-2 rounded-md">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-md font-medium text-gray-800">{event.title}</p>
                              <p className="text-sm text-gray-600">
                                {event.className} • {new Date(event.dateTime).toLocaleString("en-US", {
                                  weekday: "long",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center">No upcoming events scheduled.</p>
                      )}
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </TabsContent>

            {/* <TabsContent value="activities">
              <RecentActivitiesTable />
            </TabsContent> */}

            <TabsContent value="attendance">
              <AttendanceOverview />
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card className="border-t-4 border-t-indigo-500 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Student Performance</CardTitle>
                  <CardDescription className="text-gray-600">Overview of academic progress</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="text-lg text-gray-800">
                      Average Grade: <span className="font-bold">{studentPerformance.averageGrade}%</span>
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-gray-700">Top Performing Students</h3>
                      <ul className="list-disc pl-5 text-gray-600">
                        {studentPerformance.topStudents.length > 0 ? (
                          studentPerformance.topStudents.map((student: any, index: number) => (
                            <li key={index}>
                              {student.name} - {student.grade}%
                            </li>
                          ))
                        ) : (
                          <li>No top students data available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <Card className="border-t-4 border-t-teal-500 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Guide Activity</CardTitle>
                  <CardDescription className="text-gray-600">Guide engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-gray-800">
                    <div>
                      <p className="text-md font-medium">Active Guides</p>
                      <p className="text-2xl font-bold">{guideActivity.activeGuides}</p>
                    </div>
                    <div>
                      <p className="text-md font-medium">Total Sessions</p>
                      <p className="text-2xl font-bold">{guideActivity.totalSessions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card className="border-t-4 border-t-red-500 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">System Health</CardTitle>
                  <CardDescription className="text-gray-600">Server and application status</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-gray-800">
                    <div>
                      <p className="text-md font-medium">Uptime</p>
                      <p className="text-2xl font-bold">{systemHealth.uptime} hours</p>
                    </div>
                    <div>
                      <p className="text-md font-medium">Errors</p>
                      <p className="text-2xl font-bold">{systemHealth.errors}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}