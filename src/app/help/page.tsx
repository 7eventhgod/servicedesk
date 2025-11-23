import Link from "next/link";
import { Shield, HelpCircle, MessageCircle, FileQuestion, LifeBuoy } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create my first ticket?",
      answer: "Navigate to the Tickets section, click 'New Ticket', fill in the details, and click Submit. Your ticket will be automatically assigned based on your rules."
    },
    {
      question: "Can I customize ticket fields?",
      answer: "Yes! Go to Settings → Custom Fields to add, modify, or remove fields according to your workflow needs."
    },
    {
      question: "How does the automation engine work?",
      answer: "Automation rules trigger based on conditions (status changes, keywords, etc.) and perform actions like assigning tickets, sending emails, or updating fields automatically."
    },
    {
      question: "Is there a mobile app?",
      answer: "Our platform is fully responsive and works on any device. A native mobile app is coming in Q2 2025."
    },
    {
      question: "How do I integrate with LDAP?",
      answer: "Go to Settings → Integrations → LDAP, enter your server details, and test the connection. Users can then authenticate with their AD credentials."
    },
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes up to 10 users, 2 agents, 1GB storage, 100 tickets/month, and email support. Perfect for small teams getting started."
    }
  ];

  const helpOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FileQuestion,
      title: "FAQs",
      description: "Find answers to common questions",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: LifeBuoy,
      title: "Support Tickets",
      description: "Submit a ticket for detailed assistance",
      color: "from-purple-500 to-pink-600"
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
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-800 mb-8">
                <HelpCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">We're Here to Help</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  Help Center
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient bg-[length:200%_auto]">
                  Get Help, Fast
                </span>
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                Find answers to your questions or reach out to our support team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {helpOptions.map((option, idx) => (
                <div key={idx} className="group relative">
                  <div className="rounded-lg relative h-full border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2 p-8 text-center">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-4 mx-auto">
                      <option.icon className="h-8 w-8 text-blue-600" />
                      <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3">
                      {option.title}
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-slate-200 dark:border-slate-800 mb-16">
              <h2 className="text-3xl font-black mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6 max-w-4xl mx-auto">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400">
                      {faq.answer}
                    </p>
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
                    Still Need Help?
                  </h2>
                  <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
                    Our support team is available 24/7 to assist you
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <Link href="/contact" className="group relative">
                      <div className="absolute -inset-1 bg-white rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                      <button className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white text-blue-600 hover:bg-blue-50 text-lg px-12 h-14 font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-0 rounded-md">
                        <span className="mr-2">💬</span>
                        Contact Support
                      </button>
                    </Link>
                    <Link href="/login">
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-transparent text-white border-2 border-white/40 hover:border-white/60 hover:bg-white/20 backdrop-blur-sm text-lg px-10 h-14 font-bold transition-all duration-300 transform hover:scale-105 rounded-md">
                        Open Support Ticket
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
