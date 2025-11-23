import Link from "next/link";
import { Shield, Sparkles } from "lucide-react";

export default function ChangelogPage() {
  const releases = [
    {
      version: "v2.0.0",
      date: "December 2024",
      type: "major",
      highlights: [
        "Complete redesign with modern UI",
        "Performance improvements up to 3x faster",
        "New automation engine",
        "Enhanced mobile experience"
      ]
    },
    {
      version: "v1.8.0",
      date: "November 2024",
      type: "minor",
      highlights: [
        "Knowledge base improvements",
        "New reporting dashboard",
        "Bug fixes and stability updates"
      ]
    },
    {
      version: "v1.7.0",
      date: "October 2024",
      type: "minor",
      highlights: [
        "LDAP integration",
        "Custom fields",
        "Email templates"
      ]
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-800 mb-8">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Release Notes</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  Changelog
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient bg-[length:200%_auto]">
                  Latest Updates
                </span>
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                Stay up to date with the latest features, improvements, and fixes
              </p>
            </div>

            <div className="space-y-8">
              {releases.map((release, idx) => (
                <div key={idx} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`px-4 py-2 rounded-full font-black ${
                      release.type === "major" ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" :
                      "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}>
                      {release.version}
                    </div>
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">
                      {release.date}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {release.highlights.map((highlight, hidx) => (
                      <li key={hidx} className="flex items-start gap-3">
                        <div className="mt-1 text-blue-600">•</div>
                        <span className="text-slate-700 dark:text-slate-300">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Want to be notified of new releases? 
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold ml-2">
                  Subscribe to updates
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
