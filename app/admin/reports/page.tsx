// "use client"

// import { useState, useEffect, useRef } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { CalendarIcon, Download, FileText, Filter, Printer, Search } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { Bar, Pie, Line } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from "chart.js";

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

// export default function ReportsPage() {
//   const [date, setDate] = useState<Date | undefined>(new Date("2025-05-01"));
//   const [reportType, setReportType] = useState("students");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedClass, setSelectedClass] = useState("all");
//   const [classes, setClasses] = useState<any[]>([]);
//   const [studentData, setStudentData] = useState<any[]>([]);
//   const [awardData, setAwardData] = useState<any[]>([]);
//   const [eventData, setEventData] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const printRef = useRef<HTMLDivElement>(null);

//   const fetchClasses = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("https://education-system-backend-gray.vercel.app/api/classes", {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch classes");
//       setClasses(data);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const fetchStudentReports = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const query = new URLSearchParams();
//       if (selectedClass !== "all") query.set("classId", selectedClass);
//       if (date) query.set("date", date.toISOString());

//       const response = await fetch(`https://education-system-backend-gray.vercel.app/api/reports/students?${query.toString()}`, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch student reports");
//       setStudentData(data);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const fetchAwards = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("https://education-system-backend-gray.vercel.app/api/awards", {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch awards");
//       console.log("Awards Data:", data);
//       setAwardData(data);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const fetchEvents = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const query = new URLSearchParams();
//       if (date) query.set("date", date.toISOString());
//       if (searchTerm) query.set("search", searchTerm);

//       const response = await fetch(`https://education-system-backend-gray.vercel.app/api/events?${query.toString()}`, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch events");
//       setEventData(data);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     if (reportType === "students") {
//       fetchStudentReports();
//     } else if (reportType === "awards") {
//       fetchAwards();
//     } else if (reportType === "events") {
//       fetchEvents();
//     }
//   }, [reportType, selectedClass, date, searchTerm]);

//   const handleExport = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const query = new URLSearchParams({ type: reportType });
//       if (selectedClass !== "all") query.set("classId", selectedClass);
//       if (date) query.set("date", date.toISOString());

//       const response = await fetch(`https://education-system-backend-gray.vercel.app/api/reports/export?${query.toString()}`, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to export report");
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${reportType}-report-${format(new Date(), "yyyyMMdd")}.csv`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handlePrint = () => {
//     if (printRef.current) {
//       const printContent = printRef.current.innerHTML;
//       const originalContent = document.body.innerHTML;
//       document.body.innerHTML = `
//         <html>
//           <head>
//             <title>Print Report</title>
//             <style>
//               table { width: 100%; border-collapse: collapse; }
//               th, td { border: 1px solid black; padding: 8px; text-align: left; }
//               th { background-color: #f2f2f2; }
//               h2 { text-align: center; }
//             </style>
//           </head>
//           <body>
//             <h2>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h2>
//             ${printContent}
//           </body>
//         </html>
//       `;
//       window.print();
//       document.body.innerHTML = originalContent;
//       window.location.reload();
//     }
//   };

//   // Charts for Students
//   const studentClassDistribution = {
//     labels: classes.map(cls => cls.name),
//     datasets: [{
//       label: "Students per Class",
//       data: classes.map(cls => studentData.filter(student => student.class === cls.name).length),
//       backgroundColor: "rgba(75, 192, 192, 0.6)",
//     }],
//   };

//   const studentAwardCount = {
//     labels: studentData.map(student => student.name),
//     datasets: [{
//       label: "Awards per Student",
//       data: studentData.map(student => parseInt(student.awards) || 0),
//       backgroundColor: "rgba(153, 102, 255, 0.6)",
//     }],
//   };

//   const studentStatusPie = {
//     labels: ["Present", "Absent"],
//     datasets: [{
//       label: "Student Status",
//       data: [
//         studentData.filter(student => student.status === "Present").length,
//         studentData.filter(student => student.status === "Absent").length,
//       ],
//       backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
//     }],
//   };

//   const studentAwardsTrend = {
//     labels: studentData.map(student => student.name),
//     datasets: [{
//       label: "Awards Trend",
//       data: studentData.map(student => parseInt(student.awards) || 0),
//       borderColor: "rgba(255, 206, 86, 1)",
//       fill: false,
//     }],
//   };

//   // Charts for Awards
//   const awardTypeDistribution = {
//     labels: ["Gold", "Silver", "Bronze", "Participation"],
//     datasets: [{
//       label: "Award Types",
//       data: [
//         awardData.filter(award => award.type === "Gold").length,
//         awardData.filter(award => award.type === "Silver").length,
//         awardData.filter(award => award.type === "Bronze").length,
//         awardData.filter(award => award.type === "Participation").length,
//       ],
//       backgroundColor: [
//         "rgba(255, 215, 0, 0.6)",
//         "rgba(192, 192, 192, 0.6)",
//         "rgba(205, 127, 50, 0.6)",
//         "rgba(75, 192, 192, 0.6)",
//       ],
//     }],
//   };

//   const awardsPerClass = {
//     labels: classes.map(cls => cls.name),
//     datasets: [{
//       label: "Awards per Class",
//       data: classes.map(cls => awardData.filter(award => award.class === cls.name).length),
//       backgroundColor: "rgba(54, 162, 235, 0.6)",
//     }],
//   };

//   const awardCriteriaDistribution = {
//     labels: ["Academic", "Sports", "Arts", "Leadership"],
//     datasets: [{
//       label: "Award Criteria",
//       data: [
//         awardData.filter(award => award.criteria === "Academic").length,
//         awardData.filter(award => award.criteria === "Sports").length,
//         awardData.filter(award => award.criteria === "Arts").length,
//         awardData.filter(award => award.criteria === "Leadership").length,
//       ],
//       backgroundColor: [
//         "rgba(255, 99, 132, 0.6)",
//         "rgba(54, 162, 235, 0.6)",
//         "rgba(255, 206, 86, 0.6)",
//         "rgba(75, 192, 192, 0.6)",
//       ],
//     }],
//   };

//   const awardsOverTime = {
//     labels: awardData.map(award => new Date(award.date).toLocaleDateString()),
//     datasets: [{
//       label: "Awards Over Time",
//       data: awardData.map(() => 1), // Count of awards per date
//       borderColor: "rgba(153, 102, 255, 1)",
//       fill: false,
//     }],
//   };

//   // Charts for Events
//   const eventTypeDistribution = {
//     labels: ["Workshop", "Competition", "Celebration", "Seminar"],
//     datasets: [{
//       label: "Event Types",
//       data: [
//         eventData.filter(event => event.type === "Workshop").length,
//         eventData.filter(event => event.type === "Competition").length,
//         eventData.filter(event => event.type === "Celebration").length,
//         eventData.filter(event => event.type === "Seminar").length,
//       ],
//       backgroundColor: [
//         "rgba(255, 99, 132, 0.6)",
//         "rgba(54, 162, 235, 0.6)",
//         "rgba(255, 206, 86, 0.6)",
//         "rgba(75, 192, 192, 0.6)",
//       ],
//     }],
//   };

//   const eventsPerClass = {
//     labels: classes.map(cls => cls.name),
//     datasets: [{
//       label: "Events per Class",
//       data: classes.map(cls => eventData.filter(event => event.class === cls.name).length),
//       backgroundColor: "rgba(153, 102, 255, 0.6)",
//     }],
//   };

//   const eventDuration = {
//     labels: eventData.map(event => event.name),
//     datasets: [{
//       label: "Event Duration (hours)",
//       data: eventData.map(event => parseInt(event.duration) || 0),
//       backgroundColor: "rgba(75, 192, 192, 0.6)",
//     }],
//   };

//   const eventsOverTime = {
//     labels: eventData.map(event => new Date(event.date).toLocaleDateString()),
//     datasets: [{
//       label: "Events Over Time",
//       data: eventData.map(() => 1), // Count of events per date
//       borderColor: "rgba(255, 99, 132, 1)",
//       fill: false,
//     }],
//   };

//   const eventParticipants = {
//     labels: eventData.map(event => event.name),
//     datasets: [{
//       label: "Participants per Event",
//       data: eventData.map(event => parseInt(event.participants) || 0),
//       backgroundColor: "rgba(54, 162, 235, 0.6)",
//     }],
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
//           <p className="text-muted-foreground">Generate and view reports for students, awards, and events.</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={handlePrint}>
//             <Printer className="mr-2 h-4 w-4" />
//             Print
//           </Button>
//           <Button onClick={handleExport}>
//             <Download className="mr-2 h-4 w-4" />
//             Export
//           </Button>
//         </div>
//       </div>

//       <Tabs value={reportType} onValueChange={setReportType} className="space-y-4">
//         <TabsList className="bg-muted/50 p-1">
//           <TabsTrigger value="students" className="rounded-md">
//             Students
//           </TabsTrigger>
//           <TabsTrigger value="awards" className="rounded-md">
//             Awards
//           </TabsTrigger>
//           <TabsTrigger value="events" className="rounded-md">
//             Events
//           </TabsTrigger>
//         </TabsList>

//         <Card>
//           <CardHeader>
//             <CardTitle>
//               {reportType === "students"
//                 ? "Student Report"
//                 : reportType === "awards"
//                   ? "Awards Report"
//                   : "Events Report"}
//             </CardTitle>
//             <CardDescription>
//               {reportType === "students"
//                 ? "View detailed student reports"
//                 : reportType === "awards"
//                   ? "View all awards"
//                   : "View all event details"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//               <div className="relative flex-1">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder={`Search ${reportType}...`}
//                   className="pl-8"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   disabled={reportType !== "events"} // Search is server-side for events only
//                 />
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {date ? format(date, "PPP") : <span>Pick a date</span>}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
//                   </PopoverContent>
//                 </Popover>
//                 <Select value={selectedClass} onValueChange={setSelectedClass}>
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Filter by class" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Classes</SelectItem>
//                     {classes.map((cls: any) => (
//                       <SelectItem key={cls.classId} value={cls._id}>
//                         {cls.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Button variant="outline">
//                   <Filter className="mr-2 h-4 w-4" />
//                   More Filters
//                 </Button>
//               </div>
//             </div>

//             {error && <div className="text-red-500 text-sm">{error}</div>}

//             <div ref={printRef}>
//               {reportType === "students" && (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                     <Card>
//                       <CardHeader>Class Distribution</CardHeader>
//                       <CardContent>
//                         <Bar data={studentClassDistribution} options={{ maintainAspectRatio: false }} height={200} />
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardHeader>Awards per Student</CardHeader>
//                       <CardContent>
//                         <Bar data={studentAwardCount} options={{ maintainAspectRatio: false }} height={200} />
//                       </CardContent>
//                     </Card>
//                     {date && (
//                       <Card>
//                         <CardHeader>Status Distribution</CardHeader>
//                         <CardContent>
//                           <Pie data={studentStatusPie} options={{ maintainAspectRatio: false }} height={200} />
//                         </CardContent>
//                       </Card>
//                     )}
//                     <Card>
//                       <CardHeader>Awards Trend</CardHeader>
//                       <CardContent>
//                         <Line data={studentAwardsTrend} options={{ maintainAspectRatio: false }} height={200} />
//                       </CardContent>
//                     </Card>
//                   </div>
//                   <div className="rounded-md border">
//                     {studentData.length > 0 ? (
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Student ID</TableHead>
//                             <TableHead>Name</TableHead>
//                             <TableHead>Class</TableHead>
//                             <TableHead>Awards</TableHead>
//                             {date && <TableHead>Status</TableHead>}
//                             {date && <TableHead>Notes</TableHead>}
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {studentData.map((item) => (
//                             <TableRow key={item.id}>
//                               <TableCell>{item.id}</TableCell>
//                               <TableCell>{item.name}</TableCell>
//                               <TableCell>{item.class}</TableCell>
//                               <TableCell>{item.awards}</TableCell>
//                               {date && <TableCell>{item.status}</TableCell>}
//                               {date && <TableCell>{item.notes}</TableCell>}
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     ) : (
//                       <div className="flex items-center justify-center h-64">
//                         <div className="flex flex-col items-center text-center p-6">
//                           <FileText className="h-16 w-16 text-muted-foreground mb-4" />
//                           <h3 className="text-lg font-medium mb-2">Select Filters to Generate Student Report</h3>
//                           <p className="text-muted-foreground mb-4">
//                             Choose a class, date range, and other filters to generate a detailed student report.
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}

//               {reportType === "awards" && (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                     <Card>
//                       <CardHeader>Award Type Distribution</CardHeader>
//                       <CardContent>
//                         <Pie data={awardTypeDistribution} options={{ maintainAspectRatio: false }} height={200} />
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardHeader>Awards per Class</CardHeader>
//                       <CardContent>
//                         <Bar data={awardsPerClass} options={{ maintainAspectRatio: false }} height={200} />
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardHeader>Award Criteria</CardHeader>
//                       <CardContent>
//                         <Pie data={awardCriteriaDistribution} options={{ maintainAspectRatio: false }} height={200} />
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardHeader>Awards Over Time</CardHeader>
//                       <CardContent>
//                         <Line data={awardsOverTime} options={{ maintainAspectRatio: false }} height={200} />
//                       </CardContent>
//                     </Card>
//                   </div>
//                   <div className="rounded-md border">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Award ID</TableHead>
//                           <TableHead>Name</TableHead>
//                           <TableHead>Type</TableHead>
//                           <TableHead>Criteria</TableHead>
//                           <TableHead>Class</TableHead>
//                           <TableHead>Date</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {awardData.map((item) => (
//                           <TableRow key={item._id}>
//                             <TableCell>{item.awardId || item._id}</TableCell>
//                             <TableCell>{item.name}</TableCell>
//                             <TableCell>{item.type}</TableCell>
//                             <TableCell>{item.criteria}</TableCell>
//                             <TableCell>{item.class}</TableCell>
//                             <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </>
//               )}

//               {reportType === "events" && (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//                     <Card>
//                       <CardHeader>Event Type Distribution</CardHeader>
//                       <CardContent>
//                         <Pie data={eventTypeDistribution} options={{ maintainAspectRatio: false }} height={200} />
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardHeader>Events per Class</CardHeader>
//                       <CardContent>
//                         <Bar data={eventsPerClass} options={{ maintainAspectRatio: false }} height={200} />
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardHeader>Event Duration</CardHeader>
//                       <CardContent>
//                         <Bar data={eventDuration} options={{ maintainAspectRatio: false }} height={200} />
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardHeader>Events Over Time</CardHeader>
//                       <CardContent>
//                         <Line data={eventsOverTime} options={{ maintainAspectRatio: false }} height={200} />
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardHeader>Participants per Event</CardHeader>
//                       <CardContent>
//                         <Bar data={eventParticipants} options={{ maintainAspectRatio: false }} height={200} />
//                       </CardContent>
//                     </Card>
//                   </div>
//                   <div className="rounded-md border">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Event ID</TableHead>
//                           <TableHead>Name</TableHead>
//                           <TableHead>Type</TableHead>
//                           <TableHead>Class</TableHead>
//                           <TableHead>Date</TableHead>
//                           <TableHead>Duration</TableHead>
//                           <TableHead>Participants</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {eventData.map((item) => (
//                           <TableRow key={item._id}>
//                             <TableCell>{item.eventId || item._id}</TableCell>
//                             <TableCell>{item.name}</TableCell>
//                             <TableCell>{item.type}</TableCell>
//                             <TableCell>{item.class}</TableCell>
//                             <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
//                             <TableCell>{item.duration}</TableCell>
//                             <TableCell>{item.participants}</TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </Tabs>
//     </div>
//   );
// }

"use client"

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Download, FileText, Filter, Printer, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date("2025-05-01"));
  const [reportType, setReportType] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [classes, setClasses] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<any[]>([]);
  const [awardData, setAwardData] = useState<any[]>([]);
  const [eventData, setEventData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

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
      setClasses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setClasses([]);
    }
  };

  const fetchStudentReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams();
      if (selectedClass !== "all") query.set("classId", selectedClass);
      if (date) query.set("date", date.toISOString());

      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/reports/students?${query.toString()}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch student reports");
      setStudentData(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setStudentData([]);
    }
  };

  const fetchAwards = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/awards", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch awards");
      console.log("Awards Data:", data);
      setAwardData(Array.isArray(data.awards) ? data.awards : []);
    } catch (err: any) {
      setError(err.message);
      setAwardData([]);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams();
      if (date) query.set("date", date.toISOString());
      if (searchTerm) query.set("search", searchTerm);

      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/events?${query.toString()}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch events");
      setEventData(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setEventData([]);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (reportType === "students") {
      fetchStudentReports();
    } else if (reportType === "awards") {
      fetchAwards();
    } else if (reportType === "events") {
      fetchEvents();
    }
  }, [reportType, selectedClass, date, searchTerm]);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams({ type: reportType });
      if (selectedClass !== "all") query.set("classId", selectedClass);
      if (date) query.set("date", date.toISOString());

      const response = await fetch(`https://education-system-backend-gray.vercel.app/api/reports/export?${query.toString()}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to export report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}-report-${format(new Date(), "yyyyMMdd")}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = `
        <html>
          <head>
            <title>Print Report</title>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              h2 { text-align: center; }
            </style>
          </head>
          <body>
            <h2>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h2>
            ${printContent}
          </body>
        </html>
      `;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  // Charts for Students
  const studentClassDistribution = {
    labels: classes.map(cls => cls.name || "Unknown"),
    datasets: [{
      label: "Students per Class",
      data: classes.map(cls => (Array.isArray(studentData) ? studentData.filter(student => student.class === cls.name).length : 0)),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    }],
  };

  const studentAwardCount = {
    labels: Array.isArray(studentData) ? studentData.map(student => student.name || "Unknown") : [],
    datasets: [{
      label: "Awards per Student",
      data: Array.isArray(studentData) ? studentData.map(student => parseInt(student.awards) || 0) : [],
      backgroundColor: "rgba(153, 102, 255, 0.6)",
    }],
  };

  const studentStatusPie = {
    labels: ["Present", "Absent"],
    datasets: [{
      label: "Student Status",
      data: [
        Array.isArray(studentData) ? studentData.filter(student => student.status === "Present").length : 0,
        Array.isArray(studentData) ? studentData.filter(student => student.status === "Absent").length : 0,
      ],
      backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
    }],
  };

  const studentAwardsTrend = {
    labels: Array.isArray(studentData) ? studentData.map(student => student.name || "Unknown") : [],
    datasets: [{
      label: "Awards Trend",
      data: Array.isArray(studentData) ? studentData.map(student => parseInt(student.awards) || 0) : [],
      borderColor: "rgba(255, 206, 86, 1)",
      fill: false,
    }],
  };

  // Charts for Awards
  const awardTypeDistribution = {
    labels: ["Gold", "Silver", "Bronze", "Participation"],
    datasets: [{
      label: "Award Types",
      data: [
        Array.isArray(awardData) ? awardData.filter(award => award.criteria === "Gold").length : 0,
        Array.isArray(awardData) ? awardData.filter(award => award.criteria === "Silver").length : 0,
        Array.isArray(awardData) ? awardData.filter(award => award.criteria === "Bronze").length : 0,
        Array.isArray(awardData) ? awardData.filter(award => award.criteria === "Participation").length : 0,
      ],
      backgroundColor: [
        "rgba(255, 215, 0, 0.6)",
        "rgba(192, 192, 192, 0.6)",
        "rgba(205, 127, 50, 0.6)",
        "rgba(75, 192, 192, 0.6)",
      ],
    }],
  };

  const awardsPerClass = {
    labels: classes.map(cls => cls.name || "Unknown"),
    datasets: [{
      label: "Awards per Class",
      data: classes.map(cls => (Array.isArray(awardData) ? awardData.filter(award => award.class === cls.name).length : 0)),
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    }],
  };

  const awardCriteriaDistribution = {
    labels: ["Academic", "Sports", "Arts", "Leadership"],
    datasets: [{
      label: "Award Criteria",
      data: [
        Array.isArray(awardData) ? awardData.filter(award => award.criteria === "Academic").length : 0,
        Array.isArray(awardData) ? awardData.filter(award => award.criteria === "Sports").length : 0,
        Array.isArray(awardData) ? awardData.filter(award => award.criteria === "Arts").length : 0,
        Array.isArray(awardData) ? awardData.filter(award => award.criteria === "Leadership").length : 0,
      ],
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
      ],
    }],
  };

  const awardsOverTime = {
    labels: Array.isArray(awardData) ? awardData.map(award => new Date(award.date || "2025-05-01").toLocaleDateString()) : [],
    datasets: [{
      label: "Awards Over Time",
      data: Array.isArray(awardData) ? awardData.map(() => 1) : [],
      borderColor: "rgba(153, 102, 255, 1)",
      fill: false,
    }],
  };

  // Charts for Events
  const eventTypeDistribution = {
    labels: ["Workshop", "Competition", "Celebration", "Seminar"],
    datasets: [{
      label: "Event Types",
      data: [
        Array.isArray(eventData) ? eventData.filter(event => event.type === "Workshop").length : 0,
        Array.isArray(eventData) ? eventData.filter(event => event.type === "Competition").length : 0,
        Array.isArray(eventData) ? eventData.filter(event => event.type === "Celebration").length : 0,
        Array.isArray(eventData) ? eventData.filter(event => event.type === "Seminar").length : 0,
      ],
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
      ],
    }],
  };

  const eventsPerClass = {
    labels: classes.map(cls => cls.name || "Unknown"),
    datasets: [{
      label: "Events per Class",
      data: classes.map(cls => (Array.isArray(eventData) ? eventData.filter(event => event.class === cls.name).length : 0)),
      backgroundColor: "rgba(153, 102, 255, 0.6)",
    }],
  };

  const eventDuration = {
    labels: Array.isArray(eventData) ? eventData.map(event => event.name || "Unknown") : [],
    datasets: [{
      label: "Event Duration (hours)",
      data: Array.isArray(eventData) ? eventData.map(event => parseInt(event.duration) || 0) : [],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    }],
  };

  const eventsOverTime = {
    labels: Array.isArray(eventData) ? eventData.map(event => new Date(event.date || "2025-05-01").toLocaleDateString()) : [],
    datasets: [{
      label: "Events Over Time",
      data: Array.isArray(eventData) ? eventData.map(() => 1) : [],
      borderColor: "rgba(255, 99, 132, 1)",
      fill: false,
    }],
  };

  const eventParticipants = {
    labels: Array.isArray(eventData) ? eventData.map(event => event.name || "Unknown") : [],
    datasets: [{
      label: "Participants per Event",
      data: Array.isArray(eventData) ? eventData.map(event => parseInt(event.participants) || 0) : [],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    }],
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and view reports for students, awards, and events.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={reportType} onValueChange={setReportType} className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="students" className="rounded-md">
            Students
          </TabsTrigger>
          <TabsTrigger value="awards" className="rounded-md">
            Awards
          </TabsTrigger>
          <TabsTrigger value="events" className="rounded-md">
            Events
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>
              {reportType === "students"
                ? "Student Report"
                : reportType === "awards"
                  ? "Awards Report"
                  : "Events Report"}
            </CardTitle>
            <CardDescription>
              {reportType === "students"
                ? "View detailed student reports"
                : reportType === "awards"
                  ? "View all awards"
                  : "View all event details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${reportType}...`}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={reportType !== "events"}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((cls: any) => (
                      <SelectItem key={cls.classId} value={cls._id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div ref={printRef}>
              {reportType === "students" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardHeader>Class Distribution</CardHeader>
                      <CardContent>
                        <Bar data={studentClassDistribution} options={{ maintainAspectRatio: false }} height={200} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>Awards per Student</CardHeader>
                      <CardContent>
                        <Bar data={studentAwardCount} options={{ maintainAspectRatio: false }} height={200} />
                      </CardContent>
                    </Card>
                    {date && (
                      <Card>
                        <CardHeader>Status Distribution</CardHeader>
                        <CardContent>
                          <Pie data={studentStatusPie} options={{ maintainAspectRatio: false }} height={200} />
                        </CardContent>
                      </Card>
                    )}
                    <Card>
                      <CardHeader>Awards Trend</CardHeader>
                      <CardContent>
                        <Line data={studentAwardsTrend} options={{ maintainAspectRatio: false }} height={200} />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="rounded-md border">
                    {studentData.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Awards</TableHead>
                            {date && <TableHead>Status</TableHead>}
                            {date && <TableHead>Notes</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.class}</TableCell>
                              <TableCell>{item.awards}</TableCell>
                              {date && <TableCell>{item.status}</TableCell>}
                              {date && <TableCell>{item.notes}</TableCell>}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center text-center p-6">
                          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">Select Filters to Generate Student Report</h3>
                          <p className="text-muted-foreground mb-4">
                            Choose a class, date range, and other filters to generate a detailed student report.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {reportType === "awards" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardHeader>Award Type Distribution</CardHeader>
                      <CardContent>
                        <Pie data={awardTypeDistribution} options={{ maintainAspectRatio: false }} height={200} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>Awards per Class</CardHeader>
                      <CardContent>
                        <Bar data={awardsPerClass} options={{ maintainAspectRatio: false }} height={200} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>Award Criteria</CardHeader>
                      <CardContent>
                        <Pie data={awardCriteriaDistribution} options={{ maintainAspectRatio: false }} height={200} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>Awards Over Time</CardHeader>
                      <CardContent>
                        <Line data={awardsOverTime} options={{ maintainAspectRatio: false }} height={200} />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Award ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Criteria</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {awardData.map((item) => (
                          <TableRow key={item.awardId}>
                            <TableCell>{item.awardId}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.criteria}</TableCell>
                            <TableCell>{item.class || "N/A"}</TableCell>
                            <TableCell>{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}

              {reportType === "events" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader>Event Type Distribution</CardHeader>
                      <CardContent>
                        <Pie data={eventTypeDistribution} options={{ maintainAspectRatio: false }} height={200} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>Events per Class</CardHeader>
                      <CardContent>
                        <Bar data={eventsPerClass} options={{ maintainAspectRatio: false }} height={200} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>Event Duration</CardHeader>
                      <CardContent>
                        <Bar data={eventDuration} options={{ maintainAspectRatio: false }} height={200} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>Events Over Time</CardHeader>
                      <CardContent>
                        <Line data={eventsOverTime} options={{ maintainAspectRatio: false }} height={200} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>Participants per Event</CardHeader>
                      <CardContent>
                        <Bar data={eventParticipants} options={{ maintainAspectRatio: false }} height={200} />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Participants</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventData.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>{item.eventId || item._id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.class}</TableCell>
                            <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                            <TableCell>{item.duration}</TableCell>
                            <TableCell>{item.participants}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}