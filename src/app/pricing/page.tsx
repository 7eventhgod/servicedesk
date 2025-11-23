import Link from "next/link";
import { CheckCircle2, Shield, Zap, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const plans = [
    {
      name: "FREE",
      price: "0",
      period: "forever",
      description: "For small teams",
      features: [
        "Up to 10 users",
        "2 support agents",
        "1GB storage",
        "100 tickets/month",
        "Email support"
      ],
      cta: "Start Free Now"
    },
    {
      name: "PRO",
      price: "49",
      period: "per month",
      description: "For growing teams",
      features: [
        "Up to 50 users",
        "15 agents",
        "20GB storage",
        "Unlimited tickets",
        "SLA policies",
        "Knowledge Base",
        "IT Assets (CMDB)",
        "Priority support"
      ],
      cta: "Get Started"
    },
    {
      name: "ENTERPRISE",
      price: "199",
      period: "per month",
      description: "For large companies",
      features: [
        "Unlimited users",
        "Unlimited agents",
        "Custom storage",
        "All PRO modules +",
        "SSO (OIDC, SAML, LDAP)",
        "Custom domain",
        "API access",
        "24/7 VIP support"
      ],
      cta: "Contact Sales"
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
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-800 mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag h-4 w-4 text-blue-600">
                  <circle cx="7" cy="7" r="3"></circle>
                  <path d="m7 10-3-3L9 1a2 2 0 0 1 2 2l6 6a2 2 0 0 1 0 3L7 18a2 2 0 0 1-3-3Z"></path>
                </svg>
                <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Simple Pricing</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  Choose Your Plan
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient bg-[length:200%_auto]">
                  Scale with Confidence
                </span>
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                Start free, upgrade when you need more. All plans include our core features with no hidden fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className="relative h-full transition-all duration-700 overflow-hidden border-2 bg-white/90 dark:bg-slate-900/90 hover:scale-105 hover:shadow-xl"
                >
                  <CardHeader className="text-center pb-8 pt-8 border-b border-slate-200 dark:border-slate-700 mb-8">
                    <CardTitle className="text-3xl font-black mb-4 text-slate-900 dark:text-slate-100">
                      {plan.name}
                    </CardTitle>
                    <div className="flex items-baseline justify-center gap-2 mb-4">
                      <span className="text-7xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        ${plan.price}
                      </span>
                      <span className="text-lg text-slate-600 dark:text-slate-400">
                        /{plan.period}
                      </span>
                    </div>
                    <CardDescription className="text-base font-semibold text-slate-700 dark:text-slate-300">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-5 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-base text-slate-700 dark:text-slate-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                  
                  <div className="px-6 pb-8">
                    <Link href="/register" className="block">
                      <Button className="w-full h-14 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 border-0">
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>


            <div className="text-center">
              <div className="relative px-8 md:px-16 py-20 rounded-3xl overflow-hidden group bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                    Questions About Pricing?
                  </h2>
                  <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
                    Our team is here to help you choose the perfect plan for your needs
                  </p>
                  <Link href="/contact">
                    <Button className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 text-lg px-12 h-14 font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-0 rounded-md">
                      Contact Sales
                    </Button>
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
