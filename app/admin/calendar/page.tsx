"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameDay, parseISO } from "date-fns"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date("2025-05-01")); // Current date: May 1, 2025
  const [calendarDates, setCalendarDates] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    classes: [] as string[],
    guides: [] as string[],
  });

  const fetchEvents = async (start: Date, end: Date) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://education-system-backend-gray.vercel.app/api/events?startDate=${start.toISOString()}&endDate=${end.toISOString()}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch events");
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/classes", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch classes");
      setClasses(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchGuides = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/users?role=guide", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch guides");
      setGuides(data.users);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const generateCalendar = (date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dates = eachDayOfInterval({ start: startDate, end: endDate }).map((day) => {
      const dayEvents = events.filter((event) => isSameDay(parseISO(event.date), day));
      return {
        date: day.getDate(),
        isCurrentMonth: day.getMonth() === date.getMonth(),
        hasEvents: dayEvents.length > 0,
        events: dayEvents,
        isToday: isSameDay(day, new Date("2025-05-01")),
      };
    });

    setCalendarDates(dates);
  };

  const fetchUpcomingEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://education-system-backend-gray.vercel.app/api/events?startDate=${new Date().toISOString()}&endDate=${new Date("2025-12-31").toISOString()}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch upcoming events");
      setUpcomingEvents(data.slice(0, 4)); // Limit to 4 upcoming events
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    fetchEvents(monthStart, monthEnd);
    fetchUpcomingEvents();
    fetchClasses();
    fetchGuides();
  }, [currentDate]);

  useEffect(() => {
    generateCalendar(currentDate);
  }, [events, currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date("2025-05-01"));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentValues = prev[name as keyof typeof formData] as string[];
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter((v) => v !== value) };
      }
    });
  };

  const handleAddEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/events", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add event");
      setFormData({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        description: "",
        classes: [],
        guides: [],
      });
      setIsAddDialogOpen(false);
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      fetchEvents(monthStart, monthEnd);
      fetchUpcomingEvents();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View and manage scheduled activities and events.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white" onClick={handleToday}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>Schedule a new event or activity.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Math Workshop"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Room 101"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the event..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Classes</Label>
                  <div className="flex flex-wrap gap-2">
                    {classes.map((cls: any) => (
                      <label key={cls.classId} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={cls._id}
                          checked={formData.classes.includes(cls._id)}
                          onChange={(e) =>
                            handleMultiSelectChange("classes", cls._id, e.target.checked)
                          }
                        />
                        {cls.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Guides</Label>
                  <div className="flex flex-wrap gap-2">
                    {guides.map((guide: any) => (
                      <label key={guide.userId} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={guide._id}
                          checked={formData.guides.includes(guide._id)}
                          onChange={(e) =>
                            handleMultiSelectChange("guides", guide._id, e.target.checked)
                          }
                        />
                        {guide.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>Add Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-white" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-white" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Select defaultValue="month">
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            {/* Calendar Header - Days of Week */}
            <div className="grid grid-cols-7 text-center font-medium text-sm py-2 border-b">
              {days.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px">
              {calendarDates.map((day, i) => (
                <div
                  key={i}
                  className={`min-h-[100px] p-2 border border-gray-100 ${
                    !day.isCurrentMonth ? "bg-gray-50 text-gray-400" : "hover:bg-gray-50"
                  } ${day.isToday ? "ring-2 ring-emerald-500 ring-inset" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${day.isToday ? "text-emerald-600" : ""}`}>
                      {day.isCurrentMonth ? day.date : ""}
                    </span>
                    {day.hasEvents && day.isCurrentMonth && (
                      <div className="flex -space-x-1">
                        {Array(Math.min(day.events.length, 3))
                          .fill(0)
                          .map((_, j) => (
                            <div key={j} className="h-2 w-2 rounded-full bg-emerald-500"></div>
                          ))}
                      </div>
                    )}
                  </div>

                  {day.hasEvents && day.isCurrentMonth && (
                    <div className="mt-2">
                      {day.events.slice(0, 3).map((event: any, index: number) => (
                        <div
                          key={event.eventId}
                          className={`text-xs p-1 ${
                            index === 0 ? "bg-emerald-50 text-emerald-700" :
                            index === 1 ? "bg-blue-50 text-blue-700" :
                            "bg-purple-50 text-purple-700"
                          } rounded truncate`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event: any) => (
              <div key={event.eventId} className="p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <h3 className="font-medium">{event.title}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  <p>
                    {format(parseISO(event.date), "MMM d, yyyy")} • {event.startTime} - {event.endTime}
                  </p>
                  <p>{event.location || "TBD"}</p>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {event.classes?.map((cls: any) => (
                    <span key={cls._id} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                      {cls.name}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {event.guides?.map((guide: any) => (
                    <span key={guide._id} className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">
                      {guide.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Events
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}