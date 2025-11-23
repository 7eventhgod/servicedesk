import Link from "next/link";
import { Shield, Zap, Users, BarChart3, Clock, Bell, FileText, Webhook } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: Shield,
      title: "Complete Data Isolation",
      description: "Multi-tenancy with PostgreSQL RLS ensures 100% security of your data. Each organization's data is completely isolated from others.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Automation",
      description: "SLA policies, automatic agent assignment and ticket processing rules. Streamline your workflow with intelligent automation.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Flexible role and permission system for efficient work. Assign roles, manage permissions, and control access with granular settings.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Detailed reports and charts for decision making. Track performance metrics, response times, and team productivity in real-time.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Clock,
      title: "SLA Monitoring",
      description: "Track response and resolution time with visual indicators. Never miss a deadline with automated SLA tracking and alerts.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Group similar notifications and flexible delivery settings. Stay informed with intelligent notification management.",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: FileText,
      title: "Knowledge Base",
      description: "Create and manage a comprehensive knowledge base. Help users find answers quickly with searchable articles.",
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: Webhook,
      title: "Webhooks & Integrations",
      description: "Connect with your favorite tools via webhooks and API. Integrate with Slack, Teams, Jira, and more.",
      color: "from-cyan-500 to-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Fixed animated blob background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
      </div>

      {/* Header */}
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
            <Link href="/register">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-800 mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles h-4 w-4 text-blue-600">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                  <path d="M20 3v4"></path>
                  <path d="M22 5h-4"></path>
                  <path d="M4 17v2"></path>
                  <path d="M5 18H3"></path>
                </svg>
                <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Complete Feature Set</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  Everything You Need
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient bg-[length:200%_auto]">
                  Built In
                </span>
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                A comprehensive suite of features designed to help you manage IT support efficiently and scale your operations.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="rounded-lg relative h-full border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg blur-lg -z-10"></div>
                    <div className="flex flex-col space-y-1.5 p-6 pb-6">
                      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-4">
                        <feature.icon className={`h-8 w-8 text-blue-600`} />
                        <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      <h3 className="tracking-tight text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                    </div>
                    <div className="p-6 pt-0">
                      <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <span>Learn more</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right h-4 w-4 transform group-hover:translate-x-1 transition-transform">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Features List */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Advanced Capabilities
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Multi-language support with i18n</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">LDAP/Active Directory integration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Custom fields and workflows</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Email integration and templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Mobile-responsive design</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Enterprise Features
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">SSO (OIDC, SAML, LDAP)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Custom domain configuration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">API access and webhooks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">White-label options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Priority support and SLAs</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-24 text-center">
              <div className="relative px-8 md:px-16 py-20 rounded-3xl overflow-hidden group bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
                    Join thousands of teams using OnPoints.it to streamline their IT support operations
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <Link href="/register" className="group relative">
                      <div className="absolute -inset-1 bg-white rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                      <button className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white text-blue-600 hover:bg-blue-50 text-lg px-12 h-14 font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-0 rounded-md">
                        Start Free Trial
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </button>
                    </Link>
                    <Link href="/login">
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-transparent text-white border-2 border-white/40 hover:border-white/60 hover:bg-white/20 backdrop-blur-sm text-lg px-10 h-14 font-bold transition-all duration-300 transform hover:scale-105 rounded-md">
                        View Demo
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles ml-2 h-5 w-5">
                          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                          <path d="M20 3v4"></path>
                          <path d="M22 5h-4"></path>
                          <path d="M4 17v2"></path>
                          <path d="M5 18H3"></path>
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
