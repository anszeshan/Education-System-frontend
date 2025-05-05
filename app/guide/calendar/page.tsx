"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameDay, parseISO } from "date-fns"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function GuideCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date("2025-05-01")); // Current date: May 1, 2025
  const [calendarDates, setCalendarDates] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="p-6 space-y-6 md:ml-64 ml-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View scheduled activities and events.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white" onClick={handleToday}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today
          </Button>
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