"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, Eye } from "lucide-react"

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    activityName: "Math Workshop",
    guide: "John Smith",
    class: "Class 5A",
    date: "2023-05-01",
    attendanceRate: "95%",
  },
  {
    id: 2,
    activityName: "Science Experiment",
    guide: "Sarah Johnson",
    class: "Class 4B",
    date: "2023-05-02",
    attendanceRate: "92%",
  },
  {
    id: 3,
    activityName: "Reading Session",
    guide: "Michael Brown",
    class: "Class 3C",
    date: "2023-05-03",
    attendanceRate: "88%",
  },
  {
    id: 4,
    activityName: "Art Workshop",
    guide: "Emily Davis",
    class: "Class 6A",
    date: "2023-05-04",
    attendanceRate: "97%",
  },
  {
    id: 5,
    activityName: "Physical Education",
    guide: "David Wilson",
    class: "Class 5B",
    date: "2023-05-05",
    attendanceRate: "90%",
  },
]

export function RecentActivitiesTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredActivities = recentActivities.filter(
    (activity) =>
      activity.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.guide.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.class.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Guide</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.activityName}</TableCell>
                <TableCell>{activity.guide}</TableCell>
                <TableCell>{activity.class}</TableCell>
                <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                <TableCell>{activity.attendanceRate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
