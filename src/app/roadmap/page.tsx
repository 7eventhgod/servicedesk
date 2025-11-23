import Link from "next/link";
import { Shield, Calendar, Rocket } from "lucide-react";

export default function RoadmapPage() {
  const roadmapItems = [
    {
      quarter: "Q1 2025",
      title: "Platform Foundation",
      items: ["Multi-tenant architecture", "Core ticketing system", "User management", "Basic reporting"],
      status: "completed",
      color: "from-green-500 to-emerald-600"
    },
    {
      quarter: "Q2 2025",
      title: "Advanced Features",
      items: ["Knowledge Base", "Automation engine", "SLA tracking", "Mobile app"],
      status: "in-progress",
      color: "from-blue-500 to-indigo-600"
    },
    {
      quarter: "Q3 2025",
      title: "Enterprise Ready",
      items: ["SSO integration", "Advanced analytics", "Custom integrations", "White-label options"],
      status: "planned",
      color: "from-purple-500 to-pink-600"
    },
    {
      quarter: "Q4 2025",
      title: "AI & Automation",
      items: ["AI-powered suggestions", "Auto-categorization", "Smart routing", "Predictive analytics"],
      status: "planned",
      color: "from-orange-500 to-red-600"
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-800 mb-8">
                <Rocket className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">What's Coming</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  Roadmap
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient bg-[length:200%_auto]">
                  2025 & Beyond
                </span>
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                See what we're working on and what's coming next. Your feedback shapes our priorities.
              </p>
            </div>

            <div className="space-y-8">
              {roadmapItems.map((item, idx) => (
                <div key={idx} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-800 mb-3">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-bold text-blue-600 uppercase">{item.quarter}</span>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === "completed" && <span className="text-green-600 text-sm font-bold">✓ Completed</span>}
                      {item.status === "in-progress" && <span className="text-blue-600 text-sm font-bold">⟳ In Progress</span>}
                      {item.status === "planned" && <span className="text-purple-600 text-sm font-bold">📅 Planned</span>}
                    </div>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.items.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full bg-gradient-to-br ${item.color}`}></div>
                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="relative px-8 md:px-16 py-20 rounded-3xl overflow-hidden group bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                    Have Suggestions?
                  </h2>
                  <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
                    We'd love to hear what features you'd like to see next
                  </p>
                  <Link href="/contact">
                    <button className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 text-lg px-12 h-14 font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-0 rounded-md">
                      Share Your Ideas
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
