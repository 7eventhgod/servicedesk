import Link from "next/link";
import { Shield, Calendar, User } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      title: "Introducing OnPoints.it v2.0: A Complete Redesign",
      excerpt: "We're thrilled to announce the launch of OnPoints.it v2.0 with a stunning new interface, improved performance, and advanced features.",
      date: "December 15, 2024",
      author: "Alex Johnson",
      category: "Product Updates"
    },
    {
      title: "5 Automation Workflows Every IT Team Should Use",
      excerpt: "Learn how to save hours every week with these essential automation workflows designed for IT support teams.",
      date: "December 10, 2024",
      author: "Sarah Chen",
      category: "Best Practices"
    },
    {
      title: "How to Build a Knowledge Base That Actually Works",
      excerpt: "Creating a knowledge base that users actually search and find helpful can transform your support operations.",
      date: "December 5, 2024",
      author: "Michael Park",
      category: "Guides"
    },
    {
      title: "The Future of IT Support: AI and Automation",
      excerpt: "Explore how artificial intelligence and intelligent automation are reshaping IT support operations.",
      date: "November 28, 2024",
      author: "Emily Rodriguez",
      category: "Industry Trends"
    },
    {
      title: "Multi-Tenancy in SaaS: Lessons Learned",
      excerpt: "What we learned building secure, isolated multi-tenant architecture for enterprise customers.",
      date: "November 20, 2024",
      author: "David Kim",
      category: "Engineering"
    },
    {
      title: "Customer Success Stories: How Acme Corp Reduced Ticket Time by 40%",
      excerpt: "Discover how Acme Corporation transformed their IT support operations using OnPoints.it.",
      date: "November 15, 2024",
      author: "Lisa Anderson",
      category: "Case Studies"
    }
  ];

  const categories = [
    { name: "All", count: 24 },
    { name: "Product Updates", count: 8 },
    { name: "Best Practices", count: 6 },
    { name: "Guides", count: 4 },
    { name: "Industry Trends", count: 3 },
    { name: "Case Studies", count: 3 }
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
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-200 dark:border-purple-800 mb-8">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-600 uppercase tracking-widest">Insights & Updates</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  Blog
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient bg-[length:200%_auto]">
                  Stay in the Loop
                </span>
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                Latest news, product updates, and expert insights from the OnPoints.it team
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    idx === 0
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map((post, idx) => (
                <div key={idx} className="group relative">
                  <div className="rounded-2xl relative h-full border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg blur-lg -z-10"></div>
                    <div className="p-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-800 mb-4">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-4">
                        {post.title}
                      </h3>
                      <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="relative px-8 md:px-16 py-20 rounded-3xl overflow-hidden group bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                    Want to Get Updates?
                  </h2>
                  <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
                    Subscribe to our newsletter for the latest articles and updates
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 w-full px-6 py-4 rounded-lg border-0 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-white/50 outline-none"
                    />
                    <button className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 text-base px-8 py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 rounded-lg">
                      Subscribe
                    </button>
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
