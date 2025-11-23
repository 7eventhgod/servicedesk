import Link from "next/link";
import { Shield, BookOpen, Video, Lightbulb, Users, Rocket } from "lucide-react";

export default function GuidesPage() {
  const guides = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics and get your first ticket system running",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Set up roles, permissions, and user management",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Lightbulb,
      title: "Automation & Workflows",
      description: "Automate repetitive tasks and create custom workflows",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Rocket,
      title: "Advanced Features",
      description: "Master advanced features like SLA, CMDB, and more",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      color: "from-indigo-500 to-blue-600"
    }
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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-200 dark:border-purple-800 mb-8">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-600 uppercase tracking-widest">Step by Step</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  User Guides
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient bg-[length:200%_auto]">
                  Learn by Doing
                </span>
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                Comprehensive guides to help you master OnPoints.it and maximize your productivity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {guides.map((guide, idx) => (
                <div key={idx} className="group relative">
                  <div className="rounded-lg relative h-full border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2 p-8">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-4">
                      <guide.icon className="h-8 w-8 text-blue-600" />
                      <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3">
                      {guide.title}
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {guide.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Essential Guides
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors cursor-pointer">
                    <div className="mt-1 text-blue-600 font-bold">1.</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">Setting up your workspace</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Initialize your organization</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors cursor-pointer">
                    <div className="mt-1 text-blue-600 font-bold">2.</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">Creating your first ticket</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Learn the basics</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors cursor-pointer">
                    <div className="mt-1 text-blue-600 font-bold">3.</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">Managing team members</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Add and configure users</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors cursor-pointer">
                    <div className="mt-1 text-blue-600 font-bold">4.</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">Customizing workflows</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Tailor to your needs</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Advanced Guides
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors cursor-pointer">
                    <div className="mt-1 text-purple-600 font-bold">1.</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">SLA configuration</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Set up service levels</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors cursor-pointer">
                    <div className="mt-1 text-purple-600 font-bold">2.</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">Automation rules</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Create intelligent automations</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors cursor-pointer">
                    <div className="mt-1 text-purple-600 font-bold">3.</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">Knowledge Base</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Build your help library</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors cursor-pointer">
                    <div className="mt-1 text-purple-600 font-bold">4.</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">API integration</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Connect external services</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <div className="relative px-8 md:px-16 py-20 rounded-3xl overflow-hidden group bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                    Ready to Master OnPoints.it?
                  </h2>
                  <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
                    Start with our quick start guide and become an expert
                  </p>
                  <Link href="/register">
                    <button className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 text-lg px-12 h-14 font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-0 rounded-md">
                      Get Started Now
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
