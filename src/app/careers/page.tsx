import Link from "next/link";
import { Shield, Briefcase, MapPin, Clock } from "lucide-react";

export default function CareersPage() {
  const positions = [
    {
      title: "Senior Full-Stack Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build next-generation features for our IT support platform using Next.js, TypeScript, and PostgreSQL."
    },
    {
      title: "Product Designer",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Design beautiful, intuitive user experiences that help IT teams work more efficiently."
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      description: "Help customers succeed with OnPoints.it and ensure they get maximum value from our platform."
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Ensure our infrastructure is reliable, scalable, and secure using modern DevOps practices."
    },
    {
      title: "Sales Engineer",
      department: "Sales",
      location: "New York, NY",
      type: "Full-time",
      description: "Work with enterprise customers to understand their needs and demonstrate OnPoints.it's capabilities."
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Drive growth through content marketing, SEO, and community engagement."
    }
  ];

  const benefits = [
    { icon: "💰", text: "Competitive salary and equity" },
    { icon: "🏥", text: "Health, dental, and vision insurance" },
    { icon: "🏖️", text: "Unlimited PTO" },
    { icon: "🏠", text: "Remote-first culture" },
    { icon: "📚", text: "Learning and development budget" },
    { icon: "💻", text: "Latest tech and equipment" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Shield className="h-9 w-9 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              OnPoints.it
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 font-medium">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-500/10 border border-green-200 dark:border-green-800 mb-8">
                <Briefcase className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-green-600 uppercase tracking-widest">Join Our Team</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  Careers
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient bg-[length:200%_auto]">
                  Build the Future with Us
                </span>
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                Join a team of passionate engineers, designers, and problem-solvers building the future of IT support
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-24">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="text-center p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-5xl mb-3">{benefit.icon}</div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-16">
              <h2 className="text-4xl font-black mb-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Open Positions
              </h2>
              <div className="space-y-6">
                {positions.map((position, idx) => (
                  <div
                    key={idx}
                    className="group rounded-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden p-8 cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {position.title}
                          </h3>
                          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-600">
                            {position.department}
                          </span>
                        </div>
                        <p className="text-base text-slate-600 dark:text-slate-400 mb-4">
                          {position.description}
                        </p>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <MapPin className="h-4 w-4" />
                            <span>{position.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Clock className="h-4 w-4" />
                            <span>{position.type}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base px-8 py-4 font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 border-0 rounded-lg">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="relative px-8 md:px-16 py-20 rounded-3xl overflow-hidden group bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                    Don't See a Role That Fits?
                  </h2>
                  <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
                    We're always looking for talented people. Send us your resume and let's talk!
                  </p>
                  <Link href="/contact">
                    <button className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 text-lg px-12 h-14 font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-0 rounded-md">
                      Get in Touch
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
