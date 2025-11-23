import Link from "next/link";
import { Shield, Lock, Database, Eye, Server, Key } from "lucide-react";

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Multi-Tenant Isolation",
      description: "Each organization's data is completely isolated using PostgreSQL Row Level Security (RLS). Your data is never accessible by other tenants.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Lock,
      title: "Encryption at Rest",
      description: "All sensitive data is encrypted using industry-standard AES-256 encryption. Your database, backups, and file storage are fully protected.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Database,
      title: "Secure Backups",
      description: "Automated daily backups with point-in-time recovery. All backups are encrypted and stored in geographically distributed data centers.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Eye,
      title: "Audit Logging",
      description: "Comprehensive audit logs for all user actions. Track who did what, when, and from where with full accountability and compliance support.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Server,
      title: "99.9% Uptime SLA",
      description: "High availability architecture with automated failover. Multiple layers of redundancy ensure your service is always available.",
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: Key,
      title: "SSO & MFA",
      description: "Enterprise-grade authentication with SAML, OIDC, and LDAP support. Enable multi-factor authentication for enhanced security.",
      color: "from-cyan-500 to-teal-600"
    }
  ];

  const complianceItems = [
    { title: "GDPR Compliant", icon: "🌍" },
    { title: "SOC 2 Certified", icon: "🔒" },
    { title: "HIPAA Ready", icon: "⚕️" },
    { title: "ISO 27001", icon: "📋" }
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
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-green-600 uppercase tracking-widest">Security First</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  Your Data is Safe
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient bg-[length:200%_auto]">
                  Enterprise Security
                </span>
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                We take security seriously. Our platform is built with enterprise-grade security measures to protect your data and your business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="rounded-lg relative h-full border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2 p-6">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-4">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                      <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-slate-200 dark:border-slate-800 mb-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {complianceItems.map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="relative px-8 md:px-16 py-20 rounded-3xl overflow-hidden group bg-gradient-to-br from-green-600 via-blue-600 to-indigo-600">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                    Want to Learn More?
                  </h2>
                  <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
                    Download our security whitepaper or schedule a call with our security team
                  </p>
                  <Link href="/contact">
                    <button className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 text-lg px-12 h-14 font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-0 rounded-md">
                      Contact Security Team
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
