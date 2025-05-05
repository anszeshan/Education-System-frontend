import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Calendar, ChevronRight, ClipboardCheck, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Modern Header with Gradient Border */}
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-emerald-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Attendly
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Testimonials
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="rounded-full">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Modern Hero Section with Gradient and Pattern */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 z-0"></div>
          <div className="absolute inset-0 opacity-10 z-0">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2310b981' fillOpacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                backgroundSize: "60px 60px",
              }}
            ></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Streamline Your School
                </span>
                <br />
                Activities Management
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Attendly helps schools track attendance, monitor student progress, and manage educational activities all
                in one intuitive platform. Designed for modern educational institutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/login?role=admin">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 px-8 py-6 text-lg"
                  >
                    Admin Login
                  </Button>
                </Link>
                <Link href="/auth/login?role=guide">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg"
                  >
                    Guide Login
                  </Button>
                </Link>
              </div>
            </div>

            {/* Abstract Decoration */}
            <div className="mt-16 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-10 left-20 w-40 h-40 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

              {/* Dashboard Preview */}
              <div className="relative mx-auto max-w-4xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="h-8 bg-gray-100 flex items-center px-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="p-4">
                  <img
                    src="https://wpschoolpress.com/wp-content/uploads/2023/05/school-manag.png"
                    alt="Attendly Dashboard Preview"
                    className="w-full rounded-md shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Cards */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Features for Modern Schools</h2>
              <p className="text-lg text-gray-600">
                Our comprehensive suite of tools helps educational institutions streamline their operations and focus on
                what matters most - education.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ClipboardCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Activity Reporting</h3>
                <p className="text-gray-600 mb-6">
                  Guides can easily log activities, topics, and notes for each class session with our intuitive
                  interface.
                </p>
                <Link href="#" className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Attendance Tracking</h3>
                <p className="text-gray-600 mb-6">
                  Mark student attendance and add behavior notes for each session with our comprehensive tracking
                  system.
                </p>
                <Link href="#" className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Calendar View</h3>
                <p className="text-gray-600 mb-6">
                  Visualize all activities in a calendar format with powerful filtering options and scheduling tools.
                </p>
                <Link href="#" className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works with Modern Timeline */}
        <section id="how-it-works" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How Attendly Works</h2>
              <p className="text-lg text-gray-600">
                Our platform is designed to be intuitive and efficient, helping you manage your educational activities
                with ease.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>

                {/* Step 1 */}
                <div className="relative z-10 mb-16">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      1
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                    <h3 className="text-2xl font-semibold mb-4">Log Your Activities</h3>
                    <p className="text-gray-600 mb-4">
                      Guides select the activity, class, and fill in details about the session using our intuitive form
                      interface.
                    </p>
                    <img
                      src="https://empmonitor.com/blog/wp-content/uploads/2024/02/what-daily-activity-log.webp"
                      alt="Activity Logging Interface"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 mb-16">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      2
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                    <h3 className="text-2xl font-semibold mb-4">Track Attendance</h3>
                    <p className="text-gray-600 mb-4">
                      Mark students as present or absent and add behavior notes for each student with our comprehensive
                      tracking system.
                    </p>
                    <img
                      src="https://srisattvagroup.com/wp-content/uploads/2024/08/Attendance-Management-System.jpg"
                      alt="Attendance Tracking Interface"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      3
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                    <h3 className="text-2xl font-semibold mb-4">Generate Reports</h3>
                    <p className="text-gray-600 mb-4">
                      Admins can view and export detailed reports filtered by guide, class, activity, or date range for
                      comprehensive analysis.
                    </p>
                    <img
                      src="https://venngage-wordpress.s3.amazonaws.com/uploads/2018/04/landing-pages-that-convert.png"
                      alt="Reporting Dashboard"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Users Say</h2>
              <p className="text-lg text-gray-600">
                Hear from school administrators and guides who have transformed their educational management with
                Attendly.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-emerald-600 font-bold">JD</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">John Doe</h4>
                    <p className="text-sm text-gray-500">Principal, Lincoln High School</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Attendly has revolutionized how we manage our school activities. The reporting features have saved us
                  countless hours of administrative work."
                </p>
                <div className="flex mt-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-emerald-600 font-bold">SJ</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">Guide, Oakridge Elementary</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The attendance tracking system is intuitive and efficient. I can now focus more on teaching and less
                  on paperwork."
                </p>
                <div className="flex mt-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-emerald-600 font-bold">MB</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael Brown</h4>
                    <p className="text-sm text-gray-500">Administrator, Westfield Academy</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The analytics and reporting features have given us valuable insights into student attendance patterns
                  and activity effectiveness."
                </p>
                <div className="flex mt-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your School Management?</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
              Join thousands of educational institutions that have streamlined their operations with Attendly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="rounded-full bg-white text-emerald-600 hover:bg-gray-100 px-8 py-6 text-lg"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white text-white hover:bg-emerald-700 px-8 py-6 text-lg"
                >
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">About Attendly</h2>
                <p className="text-lg text-gray-600">
                  Attendly is a comprehensive educational program management system designed to help school principals
                  and guides track activities, attendance, and student progress efficiently.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                  <p className="text-gray-600 mb-6">
                    We believe that educational institutions should focus on teaching, not administrative burdens. Our
                    mission is to provide intuitive tools that streamline school management processes.
                  </p>
                  <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                  <p className="text-gray-600 mb-6">
                    To become the leading educational management platform that empowers schools worldwide to deliver
                    exceptional educational experiences.
                  </p>
                  <Link href="/auth/register">
                    <Button className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600">
                      Join Our Community <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                  <div className="relative">
                    <img
                      src="https://t4.ftcdn.net/jpg/06/13/33/21/360_F_613332177_rdl36d2CnlqC1tqGQE3CizEJdu9G2Ltj.jpg"
                      alt="About Attendly"
                      className="rounded-2xl shadow-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

       

        {/* Technical Features Section */}
        <section id="technical-features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Technical Features</h2>
              <p className="text-lg text-gray-600">
                Built with modern technologies to ensure security, performance, and scalability for educational
                institutions of all sizes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-semibold mb-6">Frontend Technologies</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-1 mr-4 mt-1">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">React & Next.js</h4>
                      <p className="text-gray-600 text-sm">
                        Modern, fast, and SEO-friendly React framework for building interactive user interfaces
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-1 mr-4 mt-1">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Tailwind CSS</h4>
                      <p className="text-gray-600 text-sm">
                        Utility-first CSS framework for rapid UI development with consistent design
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-1 mr-4 mt-1">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">TypeScript</h4>
                      <p className="text-gray-600 text-sm">
                        Strongly typed programming language that builds on JavaScript for better code quality
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-1 mr-4 mt-1">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Responsive Design</h4>
                      <p className="text-gray-600 text-sm">
                        Mobile-first approach ensuring perfect display on all devices from phones to desktops
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-semibold mb-6">Backend Technologies</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-1 mr-4 mt-1">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Node.js & Express</h4>
                      <p className="text-gray-600 text-sm">
                        Fast, scalable server-side JavaScript runtime with robust API framework
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-1 mr-4 mt-1">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">PostgreSQL Database</h4>
                      <p className="text-gray-600 text-sm">
                        Powerful, open-source object-relational database system with strong reputation for reliability
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-1 mr-4 mt-1">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">JWT Authentication</h4>
                      <p className="text-gray-600 text-sm">
                        Secure, token-based authentication system for protecting user data and access
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-1 mr-4 mt-1">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">RESTful API</h4>
                      <p className="text-gray-600 text-sm">
                        Well-structured API endpoints following REST principles for easy integration
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Data Security Section */}
        <section id="security" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Data Security & Privacy</h2>
              <p className="text-lg text-gray-600">
                We take the security and privacy of your school's data seriously with industry-leading protection
                measures.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://www.businesstechweekly.com/wp-content/uploads/2022/07/Data-Privacy-vs-Data-Security.jpg"
                  alt="Data Security Illustration"
                  className="rounded-2xl shadow-lg mx-auto"
                />
              </div>
              <div>
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
                      <p className="text-gray-600">
                        All sensitive data is encrypted both in transit and at rest using industry-standard encryption
                        protocols.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">GDPR Compliance</h3>
                      <p className="text-gray-600">
                        Our platform is fully compliant with GDPR and other international data protection regulations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Regular Backups</h3>
                      <p className="text-gray-600">
                        Automated daily backups with point-in-time recovery options to prevent data loss.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Role-Based Access Control</h3>
                      <p className="text-gray-600">
                        Granular permission system ensuring users only access data they're authorized to view.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* User Roles Section */}
        <section id="user-roles" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">User Roles & Permissions</h2>
              <p className="text-lg text-gray-600">
                Attendly provides tailored experiences for different user types in your educational institution.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Admin Role */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Administrators</h3>
                <p className="text-gray-600 mb-6">
                  School principals and administrative staff with full system access.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-emerald-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Manage all users and permissions</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-emerald-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Access all reports and analytics</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-emerald-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Configure system settings</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-emerald-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Manage activities and classes</span>
                  </li>
                </ul>
              </div>

              {/* Guide Role */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Guides</h3>
                <p className="text-gray-600 mb-6">Teachers and instructors who lead educational activities.</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-emerald-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Log activities and attendance</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-emerald-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>View their class schedules</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-emerald-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Add notes about students</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-emerald-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Generate class-specific reports</span>
                  </li>
                </ul>
              </div>

            
            </div>
          </div>
        </section>

        {/* Dashboard Overview Section */}
        <section id="dashboard" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Dashboard</h2>
              <p className="text-lg text-gray-600">
                Get a comprehensive overview of your school's activities with our intuitive dashboard.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
                      <p className="text-gray-600">
                        Monitor attendance trends, activity completion rates, and student engagement metrics in
                        real-time.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Calendar Integration</h3>
                      <p className="text-gray-600">
                        View all scheduled activities in a comprehensive calendar with filtering options.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Notification Center</h3>
                      <p className="text-gray-600">
                        Stay informed with alerts about upcoming activities, attendance issues, and system updates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Customizable Widgets</h3>
                      <p className="text-gray-600">
                        Personalize your dashboard with the metrics and information most relevant to your role.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="h-8 bg-gray-100 flex items-center px-4 border-b border-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <img
                      src="https://therichpost.com/wp-content/uploads/2023/10/Free-User-Managements-Admin-Dashboard-Template-26.png"
                      alt="Attendly Dashboard"
                      className="w-full rounded-md shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Experience Section */}
        <section id="mobile" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Seamless Mobile Experience</h2>
              <p className="text-lg text-gray-600">
                Access Attendly on any device with our responsive design and dedicated mobile experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                <div className="relative flex justify-center">
                  <div className="w-64 h-auto bg-gray-900 rounded-[3rem] p-2 shadow-xl relative z-10">
                    <div className="rounded-[2.5rem] overflow-hidden h-full bg-white">
                      <img
                        src="https://t4.ftcdn.net/jpg/03/18/58/87/360_F_318588746_kenL6hEDeJhlYT1gut7Gae3PBog38ili.jpg"
                        alt="Attendly Mobile App"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-64 h-auto bg-gray-900 rounded-[3rem] p-2 shadow-xl absolute left-20 top-20 rotate-6 z-0 opacity-80">
                    <div className="rounded-[2.5rem] overflow-hidden h-full bg-white">
                      <img
                        src="https://www.instancy.com/wp-content/uploads/2023/12/68-1024x576.png"
                        alt="Attendly Mobile App Second Screen"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-semibold mb-6">Take Attendly Anywhere</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium mb-2">Responsive Design</h4>
                      <p className="text-gray-600">
                        Access all features from any device with our fully responsive interface that adapts to any
                        screen size.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium mb-2">Offline Capabilities</h4>
                      <p className="text-gray-600">
                        Mark attendance and log activities even without an internet connection with automatic syncing
                        when back online.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium mb-2">Push Notifications</h4>
                      <p className="text-gray-600">
                        Stay informed with real-time alerts about attendance issues, upcoming activities, and important
                        announcements.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium mb-2">Quick Actions</h4>
                      <p className="text-gray-600">
                        Perform common tasks with just a few taps using our optimized mobile interface and shortcuts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
                Find answers to common questions about Attendly and how it can help your educational institution.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-3">How secure is our school's data on Attendly?</h3>
                  <p className="text-gray-600">
                    Attendly employs industry-standard security measures including end-to-end encryption, regular
                    security audits, and compliance with GDPR and other data protection regulations. Your data is stored
                    in secure, redundant servers with regular backups.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Can Attendly integrate with our existing school management system?
                  </h3>
                  <p className="text-gray-600">
                    Yes, Attendly offers API integration capabilities that allow it to connect with most popular school
                    management systems. Our team can work with you to ensure smooth data synchronization between
                    platforms.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    How long does it take to implement Attendly at our school?
                  </h3>
                  <p className="text-gray-600">
                    Most schools are up and running with Attendly within 1-2 weeks. Our onboarding process includes data
                    import, user setup, and training sessions for administrators and guides to ensure a smooth
                    transition.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-3">Does Attendly work offline?</h3>
                  <p className="text-gray-600">
                    Yes, our mobile application includes offline functionality that allows guides to mark attendance and
                    log activities even without an internet connection. Data will automatically sync when connectivity
                    is restored.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-3">Can parents access their children's information?</h3>
                  <p className="text-gray-600">
                    Yes, Attendly offers a parent portal where parents can view their children's attendance records,
                    upcoming activities, and progress reports. Access is controlled by school administrators to ensure
                    privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
              <p className="text-lg text-gray-600">
                Have questions or ready to transform your school's management? Our team is here to help.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Phone</h4>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Email</h4>
                      <p className="text-gray-600">info@attendly.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Address</h4>
                      <p className="text-gray-600">
                        123 Education Lane, Suite 400
                        <br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Business Hours</h4>
                      <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 10:00 AM - 2:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Subject"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Your message"
                    ></textarea>
                  </div>

                  <Button className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer with Gradient */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-12">
            <div className="mb-12 md:mb-0 max-w-xs">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-8 w-8 text-emerald-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Attendly
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Streamlining educational activity management for schools and educational programs worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Testimonials
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Team
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-gray-400">© {new Date().getFullYear()} Attendly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
