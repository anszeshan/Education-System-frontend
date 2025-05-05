"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarIcon, Download, Eye, Filter, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

// Mock data for activity reports
const activityReports = [
  {
    id: 1,
    activity: "Math Workshop",
    class: "Class 5A",
    date: "2025-05-01",
    topic: "Fractions",
    attendanceRate: "92.9%",
  },
  {
    id: 2,
    activity: "Science Experiment",
    class: "Class 4B",
    date: "2025-04-28",
    topic: "Photosynthesis",
    attendanceRate: "88.0%",
  },
  {
    id: 3,
    activity: "Reading Session",
    class: "Class 3C",
    date: "2025-04-25",
    topic: "Poetry",
    attendanceRate: "90.9%",
  },
  {
    id: 4,
    activity: "Art Workshop",
    class: "Class 5A",
    date: "2025-04-22",
    topic: "Watercolors",
    attendanceRate: "96.4%",
  },
  {
    id: 5,
    activity: "Physical Education",
    class: "Class 4B",
    date: "2025-04-20",
    topic: "Team Sports",
    attendanceRate: "96.0%",
  },
]

// Mock data for attendance reports
const attendanceReports = [
  {
    id: 1,
    class: "Class 5A",
    date: "2025-05-01",
    activity: "Math Workshop",
    totalStudents: 28,
    present: 26,
    absent: 2,
  },
  {
    id: 2,
    class: "Class 4B",
    date: "2025-04-28",
    activity: "Science Experiment",
    totalStudents: 25,
    present: 22,
    absent: 3,
  },
  {
    id: 3,
    class: "Class 3C",
    date: "2025-04-25",
    activity: "Reading Session",
    totalStudents: 22,
    present: 20,
    absent: 2,
  },
  {
    id: 4,
    class: "Class 5A",
    date: "2025-04-22",
    activity: "Art Workshop",
    totalStudents: 28,
    present: 27,
    absent: 1,
  },
  {
    id: 5,
    class: "Class 4B",
    date: "2025-04-20",
    activity: "Physical Education",
    totalStudents: 25,
    present: 24,
    absent: 1,
  },
]

export default function ReportsPage() {
  const [date, setDate] = useState<Date>()
  const [reportType, setReportType] = useState("activities")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)

  // Filter reports based on search term and selected class
  const filteredActivityReports = activityReports.filter(
    (report) =>
      (selectedClass === "all" || report.class.toLowerCase().includes(selectedClass.toLowerCase())) &&
      (report.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.topic.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const filteredAttendanceReports = attendanceReports.filter(
    (report) =>
      (selectedClass === "all" || report.class.toLowerCase().includes(selectedClass.toLowerCase())) &&
      (report.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.class.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleViewReport = (report: any) => {
    setSelectedReport(report)
    setIsReportDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6 md:ml-64 ml-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
          <p className="text-muted-foreground">View and manage your submitted reports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-black hover:bg-gray-800 text-white">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-8 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-[240px] justify-start text-left font-normal bg-white">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full md:w-[180px] bg-white">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="class-5a">Class 5A</SelectItem>
            <SelectItem value="class-4b">Class 4B</SelectItem>
            <SelectItem value="class-3c">Class 3C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="activities" className="space-y-4" onValueChange={setReportType}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="activities" className="rounded-md">
            Activity Reports
          </TabsTrigger>
          <TabsTrigger value="attendance" className="rounded-md">
            Attendance Reports
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>{reportType === "activities" ? "Activity Reports" : "Attendance Reports"}</CardTitle>
            <CardDescription>
              {reportType === "activities"
                ? "View your submitted activity reports"
                : "View your submitted attendance records"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {reportType === "activities" ? (
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Attendance Rate</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  )}
                </TableHeader>
                <TableBody>
                  {reportType === "activities"
                    ? filteredActivityReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                          <TableCell>{report.activity}</TableCell>
                          <TableCell>{report.class}</TableCell>
                          <TableCell>{report.topic}</TableCell>
                          <TableCell>{report.attendanceRate}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleViewReport(report)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    : filteredAttendanceReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                          <TableCell>{report.class}</TableCell>
                          <TableCell>{report.activity}</TableCell>
                          <TableCell>{report.present}</TableCell>
                          <TableCell>{report.absent}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleViewReport(report)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      {/* Report Details Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {reportType === "activities" ? "Activity Report Details" : "Attendance Report Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedReport && new Date(selectedReport.date).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedReport && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium">Activity:</div>
                  <div className="col-span-3">{selectedReport.activity}</div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium">Class:</div>
                  <div className="col-span-3">{selectedReport.class}</div>
                </div>
                {reportType === "activities" && (
                  <div className="grid grid-cols-4 gap-4">
                    <div className="font-medium">Topic:</div>
                    <div className="col-span-3">{selectedReport.topic}</div>
                  </div>
                )}
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium">Attendance:</div>
                  <div className="col-span-3">
                    {reportType === "activities"
                      ? selectedReport.attendanceRate
                      : `${selectedReport.present}/${selectedReport.totalStudents} (${
                          (selectedReport.present / selectedReport.totalStudents) * 100
                        }%)`}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsReportDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
