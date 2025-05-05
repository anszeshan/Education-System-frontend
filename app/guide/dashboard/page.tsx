"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PenSquare, Users, Calendar, FileText, ArrowRight, ArrowUpRight } from "lucide-react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { format, parseISO } from "date-fns"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Dummy data for fallback
const dummyMetrics = {
  totalActivities: 25,
  totalStudents: 60,
  totalClasses: 3,
  activityChange: 10,
  studentChange: -5,
}

const dummyWeeklyActivities = [
  { date: "2025-05-05", count: 5 },
  { date: "2025-05-06", count: 3 },
  { date: "2025-05-07", count: 4 },
  { date: "2025-05-08", count: 2 },
  { date: "2025-05-09", count: 6 },
  { date: "2025-05-10", count: 1 },
  { date: "2025-05-11", count: 3 },
]

const dummyRecentActivities = [
  {
    _id: "1",
    title: "Math Workshop",
    class: { _id: "c1", name: "Class 5A" },
    date: "2025-05-01",
    attendance: "26/28 students",
  },
  {
    _id: "2",
    title: "Science Experiment",
    class: { _id: "c2", name: "Class 4B" },
    date: "2025-04-29",
    attendance: "23/25 students",
  },
  {
    _id: "3",
    title: "Reading Session",
    class: { _id: "c3", name: "Class 3C" },
    date: "2025-04-28",
    attendance: "20/22 students",
  },
]

const dummyUpcomingEvents = [
  {
    eventId: "e1",
    title: "Math Workshop",
    date: "2025-05-05",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    location: "Room 101",
    classes: [{ _id: "c1", name: "Class 5A" }],
    guides: [{ _id: "g1", name: "Sarah Johnson" }],
  },
  {
    eventId: "e2",
    title: "Science Experiment",
    date: "2025-05-06",
    startTime: "1:00 PM",
    endTime: "2:30 PM",
    location: "Lab B",
    classes: [{ _id: "c2", name: "Class 4B" }],
    guides: [{ _id: "g1", name: "Sarah Johnson" }],
  },
  {
    eventId: "e3",
    title: "Reading Session",
    date: "2025-05-07",
    startTime: "9:00 AM",
    endTime: "10:00 AM",
    location: "Library",
    classes: [{ _id: "c3", name: "Class 3C" }],
    guides: [{ _id: "g1", name: "Sarah Johnson" }],
  },
]

const dummyRecentBadges = [
  {
    _id: "b1",
    badge: "Perfect Attendance",
    student: "Alex Johnson",
    class: { _id: "c1", name: "Class 5A" },
    date: "2025-05-01",
    icon: "🌟",
  },
  {
    _id: "b2",
    badge: "Most Improved",
    student: "Emma Williams",
    class: { _id: "c2", name: "Class 4B" },
    date: "2025-04-29",
    icon: "📈",
  },
  {
    _id: "b3",
    badge: "Positive Behavior",
    student: "Noah Brown",
    class: { _id: "c3", name: "Class 3C" },
    date: "2025-04-28",
    icon: "😊",
  },
]

const dummyAttendanceOverview = [
  { class: { _id: "c1", name: "Class 5A" }, attendance: "92%", trend: "up" },
  { class: { _id: "c2", name: "Class 4B" }, attendance: "88%", trend: "stable" },
  { class: { _id: "c3", name: "Class 3C" }, attendance: "95%", trend: "up" },
]

export default function GuideDashboard() {
  const [profile, setProfile] = useState({ name: "Guide", guideId: "" })
  const [metrics, setMetrics] = useState(dummyMetrics)
  const [weeklyActivities, setWeeklyActivities] = useState<any[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [recentBadges, setRecentBadges] = useState<any[]>([])
  const [attendanceOverview, setAttendanceOverview] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch guide profile and guideId
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/users/profile", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch profile")
      setProfile({ name: data.name || "Guide", guideId: data._id || "" })
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Fetch guide-specific metrics
  const fetchMetrics = async (guideId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/dashboard/guide-metrics?guideId=${guideId}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch metrics")
      setMetrics(
        data.totalActivities || data.totalStudents || data.totalClasses
          ? {
              totalActivities: data.totalActivities || 0,
              totalStudents: data.totalStudents || 0,
              totalClasses: data.totalClasses || 0,
              activityChange: data.activityChange || 0,
              studentChange: data.studentChange || 0,
            }
          : dummyMetrics
      )
    } catch (err: any) {
      setError(err.message)
      setMetrics(dummyMetrics)
    }
  }

  // Fetch weekly activities
  const fetchWeeklyActivities = async (guideId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/dashboard/guide-weekly-activities?guideId=${guideId}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch weekly activities")
      setWeeklyActivities(data.days && data.days.length > 0 ? data.days : dummyWeeklyActivities)
    } catch (err: any) {
      setError(err.message)
      setWeeklyActivities(dummyWeeklyActivities)
    }
  }

  // Fetch recent activities
  // const fetchRecentActivities = async (guideId: string) => {
  //   try {
  //     const token = localStorage.getItem("token")
  //     const response = await fetch(`https://education-system-backend-gray.vercel.app/api/activities/recent?guideId=${guideId}`, {
  //       headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  //     })
  //     const data = await response.json()
  //     if (!response.ok) throw new Error(data.message || "Failed to fetch recent activities")
  //     setRecentActivities(data && data.length > 0 ? data.slice(0, 4) : dummyRecentActivities)
  //   } catch (err: any) {
  //     setError(err.message)
  //     setRecentActivities(dummyRecentActivities)
  //   }
  // }

  // Fetch upcoming events
  const fetchUpcomingEvents = async (guideId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://education-system-backend-gray.vercel.app/api/events?guideId=${guideId}&startDate=${new Date().toISOString()}&endDate=${new Date(
          "2025-12-31"
        ).toISOString()}`,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch upcoming events")
      setUpcomingEvents(data && data.length > 0 ? data.slice(0, 4) : dummyUpcomingEvents)
    } catch (err: any) {
      setError(err.message)
      setUpcomingEvents(dummyUpcomingEvents)
    }
  }

  // Fetch recent badges
  // const fetchRecentBadges = async (guideId: string) => {
  //   try {
  //     const token = localStorage.getItem("token")
  //     const response = await fetch(`https://education-system-backend-gray.vercel.app/api/badges/recent?guideId=${guideId}`, {
  //       headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  //     })
  //     const data = await response.json()
  //     if (!response.ok) throw new Error(data.message || "Failed to fetch recent badges")
  //     setRecentBadges(data && data.length > 0 ? data.slice(0, 4) : dummyRecentBadges)
  //   } catch (err: any) {
  //     setError(err.message)
  //     setRecentBadges(dummyRecentBadges)
  //   }
  // }

  // Fetch attendance overview
  // const fetchAttendanceOverview = async (guideId: string) => {
  //   try {
  //     const token = localStorage.getItem("token")
  //     const response = await fetch(`https://education-system-backend-gray.vercel.app/api/attendance/overview?guideId=${guideId}`, {
  //       headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  //     })
  //     const data = await response.json()
  //     if (!response.ok) throw new Error(data.message || "Failed to fetch attendance overview")
  //     setAttendanceOverview(data && data.length > 0 ? data.slice(0, 4) : dummyAttendanceOverview)
  //   } catch (err: any) {
  //     setError(err.message)
  //     setAttendanceOverview(dummyAttendanceOverview)
  //   }
  // }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchProfile()
      if (profile.guideId) {
        await Promise.all([
         // fetchMetrics(profile.guideId),
        //  fetchWeeklyActivities(profile.guideId),
       //   fetchRecentActivities(profile.guideId),
          fetchUpcomingEvents(profile.guideId),
         // fetchRecentBadges(profile.guideId),
          // fetchAttendanceOverview(profile.guideId),
        ])
      }
      setLoading(false)
    }
    loadData()
  }, [selectedDate, profile.guideId])

  const chartData = {
    labels: weeklyActivities.map((day: any) =>
      new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })
    ),
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
    <div className="min-h-screen bg-gray-50 p-6 md:ml-64 ml-0">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Welcome, {profile.name}!</h1>
            <p className="text-lg text-gray-600 mt-1">
              Overview of your activities as of {selectedDate.toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              asChild
            >
              <Link href="/guide/reports">
                <FileText className="mr-2 h-5 w-5" />
                View Reports
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {loading && <div className="text-center text-gray-600">Loading dashboard data...</div>}
      {error && <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>}

      {!loading && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/guide/log-activity">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <PenSquare className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Log Activity</h3>
                    <p className="text-sm text-muted-foreground">Record a new activity session</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/guide/attendance">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Mark Attendance</h3>
                    <p className="text-sm text-muted-foreground">Record student attendance</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/guide/reports">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">My Reports</h3>
                    <p className="text-sm text-muted-foreground">View your submitted reports</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Key Metrics */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Metrics</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between p-4 bg-emerald-50">
                  <div className="flex items-center space-x-3">
                    <PenSquare className="h-6 w-6 text-emerald-600" />
                    <p className="text-md font-medium text-gray-700">Total Activities</p>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-md">
                    <PenSquare className="h-6 w-6 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-gray-900">{metrics.totalActivities}</div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-5 w-5 text-emerald-600 mr-1" />
                    <p className="text-sm text-emerald-600 font-medium">
                      {metrics.activityChange >= 0
                        ? `+${metrics.activityChange}%`
                        : `${metrics.activityChange}%`}{" "}
                      (Last Month)
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
                      {metrics.studentChange >= 0 ? `+${metrics.studentChange}%` : `${metrics.studentChange}%`}{" "}
                      (Last Month)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between p-4 bg-purple-50">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-purple-600" />
                    <p className="text-md font-medium text-gray-700">Assigned Classes</p>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-md">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-gray-900">{metrics.totalClasses}</div>
                  <p className="text-sm text-gray-600 mt-2">{metrics.totalClasses} assigned classes</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="overview"
                className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="badges"
                className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                Recent Badges
              </TabsTrigger>
              <TabsTrigger
                value="attendance"
                className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                Attendance Overview
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
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/guide/calendar">View Calendar</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-t-4 border-t-purple-500 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Recent Activities</CardTitle>
                  <CardDescription className="text-gray-600">Your most recent activity sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity: any) => (
                      <div
                        key={activity._id}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="bg-emerald-100 p-2 rounded-md mr-4">
                          <PenSquare className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {activity.class.name} • {format(parseISO(activity.date), "MMM d, yyyy")}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-emerald-600">{activity.attendance}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">No recent activities found.</p>
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/guide/reports">View All Activities</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="space-y-6">
              <Card className="border-t-4 border-t-amber-500 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Recently Awarded Badges</CardTitle>
                  <CardDescription className="text-gray-600">Badges you’ve awarded recently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentBadges.length > 0 ? (
                    recentBadges.map((badge: any) => (
                      <div
                        key={badge._id}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="bg-amber-100 p-2 rounded-md mr-4 text-center w-10 h-10 flex items-center justify-center text-xl">
                          {badge.icon || "🏅"}
                        </div>
                        <div>
                          <h4 className="font-medium">{badge.badge}</h4>
                          <p className="text-sm text-muted-foreground">
                            Awarded to {badge.student} • {badge.class.name} •{" "}
                            {format(parseISO(badge.date), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">No badges awarded recently.</p>
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/guide/badges">Award New Badge</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6">
              <Card className="border-t-4 border-t-teal-500 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Attendance Overview</CardTitle>
                  <CardDescription className="text-gray-600">Attendance statistics for your classes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {attendanceOverview.length > 0 ? (
                    attendanceOverview.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium">{item.class.name}</div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{item.attendance}</span>
                          {item.trend === "up" && (
                            <div className="text-emerald-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                          {item.trend === "down" && (
                            <div className="text-red-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                          {item.trend === "stable" && (
                            <div className="text-gray-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">No attendance data available.</p>
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/guide/attendance">View Attendance</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}