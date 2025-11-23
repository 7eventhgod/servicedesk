import Link from "next/link";
import { Shield, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function StatusPage() {
  const statusItems = [
    { name: "API", status: "operational", uptime: "99.99%" },
    { name: "Web App", status: "operational", uptime: "99.98%" },
    { name: "Database", status: "operational", uptime: "100%" },
    { name: "Storage", status: "operational", uptime: "99.95%" },
    { name: "Email", status: "operational", uptime: "99.97%" },
    { name: "Webhooks", status: "operational", uptime: "99.96%" }
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-500/10 border border-green-200 dark:border-green-800 mb-8">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-green-600 uppercase tracking-widest">All Systems Operational</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  System Status
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  100% Uptime
                </span>
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                Real-time monitoring of all OnPoints.it services
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-black mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    99.99%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold">Overall Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    0
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold">Active Incidents</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    6
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold">Services Monitored</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {statusItems.map((item, idx) => (
                <div key={idx} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.status === "operational" ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Last checked 2 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-black text-green-600">
                          {item.uptime}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          30-day average
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Incident History
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  No incidents in the last 90 days
                </p>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Perfect uptime record maintained</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
