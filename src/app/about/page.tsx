import Link from "next/link";
import { Shield, Target, Award, Users } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to making IT support effortless for teams worldwide.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Customer-Focused",
      description: "Your success is our success. We build features you actually need.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Award,
      title: "Quality First",
      description: "We don't compromise on quality, security, or performance.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Your data security and privacy are not negotiable.",
      color: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "500+", label: "Companies" },
    { number: "99.9%", label: "Uptime SLA" },
    { number: "24/7", label: "Support" }
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
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-800 mb-8">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Our Story</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  About OnPoints.it
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient bg-[length:200%_auto]">
                  Building the Future of IT Support
                </span>
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                We're a team of engineers and designers passionate about making IT support management simple, powerful, and accessible to everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-lg text-slate-700 dark:text-slate-300 font-semibold">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-slate-200 dark:border-slate-800 mb-16">
              <h2 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our Story
              </h2>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  OnPoints.it was born from the frustration of managing IT support with outdated, clunky systems. We believed that supporting users shouldn't be complicated—it should be intuitive, fast, and powerful.
                </p>
                <p>
                  Our platform is built from the ground up with modern technologies, focusing on what matters most: your team's productivity and your users' satisfaction. We've taken the best practices from enterprise software and made them accessible to teams of all sizes.
                </p>
                <p>
                  Today, thousands of organizations trust OnPoints.it to manage their IT support operations. We're just getting started, and we're excited to have you join us on this journey.
                </p>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-4xl font-black mb-12 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, idx) => (
                  <div key={idx} className="group relative">
                    <div className="rounded-lg relative h-full border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2 p-6">
                      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-4">
                        <value.icon className="h-8 w-8 text-blue-600" />
                        <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                        {value.description}
                      </p>
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
                    Want to Join Us?
                  </h2>
                  <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
                    We're always looking for talented people to join our mission
                  </p>
                  <Link href="/careers">
                    <button className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 text-lg px-12 h-14 font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-0 rounded-md">
                      View Open Positions
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
