"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Info } from "lucide-react"

export default function LogActivityPage() {
  const [formData, setFormData] = useState({
    activity: "",
    class: "",
    topic: "",
    description: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
  })
  const [activities, setActivities] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [selectedLog, setSelectedLog] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/activities", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch activities")
      setActivities(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Fetch classes assigned to the guide
  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/classes", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch classes")
      const guideId = localStorage.getItem("userId")
      const filteredClasses = Array.isArray(data) ? data : data.classes || []
      const matchedClasses = filteredClasses.filter((cls) =>
        cls.assignedGuides?.some((guide: any) => guide.toString() === guideId || parseInt(guide) === parseInt(guideId))
      )
      setClasses(matchedClasses || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Fetch activity logs for the guide
  // const fetchActivityLogs = async () => {
  //   try {
  //     const token = localStorage.getItem("token")
  //     const response = await fetch("https://education-system-backend-gray.vercel.app/api/activity-logs", {
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     const data = await response.json()
  //     if (!response.ok) throw new Error(data.message || "Failed to fetch activity logs")
  //     setActivityLogs(data || [])
  //   } catch (err: any) {
  //     setError(err.message)
  //   }
  // }

  useEffect(() => {
    fetchActivities()
    fetchClasses()
    // fetchActivityLogs()
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogSelect = (logId: string) => {
    setSelectedLog(logId)
    const log = activityLogs.find((l) => l._id === logId)
    if (log) {
      setFormData({
        activity: log.activityId?._id || "",
        class: log.classId?._id || "",
        topic: log.topic || "",
        description: log.description || "",
        notes: log.notes || "",
        date: log.date ? new Date(log.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        startTime: log.startTime || "",
        endTime: log.endTime || "",
      })
    }
  }
  const guideId = localStorage.getItem("userId")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/activity-logs", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guideId: guideId,
          activityId: formData.activity,
          classId: formData.class,
          topic: formData.topic,
          description: formData.description,
          notes: formData.notes,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to log activity")

      setIsSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setSelectedLog("")
        setFormData({
          activity: "",
          class: "",
          topic: "",
          description: "",
          notes: "",
          date: new Date().toISOString().split("T")[0],
          startTime: "",
          endTime: "",
        })
       // fetchActivityLogs() // Refresh activity logs after submission
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6 md:ml-64 ml-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Log Activity</h1>
        <p className="text-muted-foreground">Record details about your activity session.</p>
      </div>

      {isSuccess && (
        <Alert className="bg-emerald-50 border-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-emerald-600">Activity Logged Successfully</AlertTitle>
          <AlertDescription className="text-emerald-700">
            Your activity has been recorded. You can now proceed to mark attendance for this session.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <Info className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-600">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Activity Logs Dropdown */}
      {/* <div className="space-y-2">
        <Label htmlFor="activityLog">Select Previous Activity Log (Optional)</Label>
        <Select value={selectedLog} onValueChange={handleLogSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a previous activity log" />
          </SelectTrigger>
          <SelectContent>
            {activityLogs.map((log) => (
              <SelectItem key={log._id} value={log._id}>
                {log.topic} - {log.classId?.name} ({new Date(log.date).toLocaleDateString()})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Activity Details</CardTitle>
            <CardDescription>Select the activity and class, then provide details about the session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="activity">
                  Activity Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.activity} onValueChange={(value) => handleChange("activity", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map((activity) => (
                      <SelectItem key={activity._id} value={activity._id}>
                        {activity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">
                  Class <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.class} onValueChange={(value) => handleChange("class", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls._id} value={cls._id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">
                  Start Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">
                  End Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">
                Activity Topic <span className="text-red-500">*</span>
              </Label>
              <Input
                id="topic"
                placeholder="e.g., Fractions, Photosynthesis, etc."
                value={formData.topic}
                onChange={(e) => handleChange("topic", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Provide a brief description of the activity..."
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Special Notes or Challenges (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special notes, challenges, or achievements to mention..."
                rows={3}
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-700">Next Step: Mark Attendance</h4>
                <p className="text-sm text-blue-600">
                  After logging this activity, you'll be able to mark attendance for the students in this class.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Log Activity"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}