"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  Clock, 
  Bell,
  FileText,
  ArrowRight,
  Building2,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Complete Data Isolation",
      description: "Multi-tenancy with PostgreSQL RLS ensures 100% security of your data"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Automation",
      description: "SLA policies, automatic agent assignment and ticket processing rules"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Team Management",
      description: "Flexible role and permission system for efficient work"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Real-time Analytics",
      description: "Detailed reports and charts for decision making"
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: "SLA Monitoring",
      description: "Track response and resolution time with visual indicators"
    },
    {
      icon: <Bell className="h-8 w-8 text-red-600" />,
      title: "Smart Notifications",
      description: "Group similar notifications and flexible delivery settings"
    },
    {
      icon: <FileText className="h-8 w-8 text-indigo-600" />,
      title: "Knowledge Base",
      description: "Create articles and documentation for quick resolution of common questions"
    },
    {
      icon: <Building2 className="h-8 w-8 text-cyan-600" />,
      title: "LDAP/Active Directory",
      description: "Integration with corporate infrastructure in 2 minutes"
    }
  ];

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
      highlighted: false
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
      highlighted: false
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
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 via-indigo-50/40 to-purple-50/20 relative overflow-hidden">
      {/* Premium animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <Building2 className="h-9 w-9 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              OnPoints.it
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-500 group/neuph">
              <div className="relative">
                <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
                <div className="absolute inset-0 bg-blue-600 blur-lg opacity-30 group-hover/neuph:opacity-50 transition-opacity"></div>
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-wide">
                Trusted by Enterprise Teams Worldwide
              </span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight">
                <div className="inline-block">
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    Transform
                  </span>
                </div>
                <div className="inline-block mt-2">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-blue-50 dark:to-white">
                    IT Support
                  </span>
                </div>
                <div className="relative inline-block mt-3">
                  <span className="relative z-10 block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                    Forever
                  </span>
                  {/* Decorative underline */}
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
                </div>
              </h1>
              
              <p className="text-2xl md:text-3xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-light mt-8">
                The only ticket management system that grows with your business.
                <br className="hidden md:block" />
                <span className="font-medium text-blue-600 dark:text-blue-400"> Multi-tenant, secure, automatable.</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
              <Link href="/register" className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <Button 
                  size="lg" 
                  className="relative text-lg px-12 h-18 font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 border-0"
                >
                  Start Free
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 h-18 font-semibold border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-transparent via-blue-50/20 to-transparent">
        <div className="container mx-auto relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-800 mb-8">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Powerful Features</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  Everything you need,
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient bg-[length:200%_auto]">
                  Nothing you don&apos;t
                </span>
              </h2>
              <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                Built by engineers, for engineers. Every feature designed with performance and usability in mind.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <Card className="relative h-full border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    {/* Icon wrapper */}
                    <CardHeader className="pb-6">
                      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <CardDescription className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-transparent via-purple-50/20 to-transparent">
        <div className="container mx-auto relative z-10">
          <div className="max-w-8xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-200 dark:border-purple-800 mb-8">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-600 uppercase tracking-widest">Simple Pricing</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  One price. 
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 animate-gradient bg-[length:200%_auto]">
                  Unlimited possibilities
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Start free. Scale effortlessly. Upgrade when you&apos;re ready.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {plans.map((plan, index) => (
                <div 
                  key={index}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <Card className="relative h-full transition-all duration-700 overflow-hidden border-2 bg-white/90 dark:bg-slate-900/90 hover:scale-105 hover:shadow-xl">
                    
                    <div className="relative p-8">
                      {/* Plan header */}
                      <CardHeader className="text-center pb-8 pt-4 border-b border-slate-200 dark:border-slate-700 mb-8">
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
                      
                      {/* Features list */}
                      <CardContent className="space-y-5 mb-8">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 group/feature">
                            <div className="mt-0.5 p-1 rounded-full bg-green-50 dark:bg-green-950/30">
                              <CheckCircle2 className="h-5 w-5 text-green-600 group-hover/feature:scale-125 transition-transform" />
                            </div>
                            <span className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </CardContent>
                      
                      {/* CTA Button */}
                      <Link href="/register" className="block">
                        <Button 
                          className="w-full h-16 text-base font-bold group/btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 border-0"
                        >
                          {plan.name === "FREE" ? (
                            <>Start Free Now</>
                          ) : plan.highlighted ? (
                            <>Get Started <ArrowRight className="ml-2 h-5 w-5 inline group-hover/btn:translate-x-2 transition-transform duration-300" /></>
                          ) : (
                            <>Choose Plan <ArrowRight className="ml-2 h-5 w-5 inline group-hover/btn:translate-x-1 transition-transform" /></>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="relative px-8 md:px-16 py-20 rounded-3xl overflow-hidden group">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-8 shadow-lg">
                  <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
                  <span className="text-sm font-bold text-white uppercase tracking-widest">Ready to Get Started?</span>
                </div>
                
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                  <span className="block text-white mb-2">Start Your Free</span>
                  <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    Trial Today
                  </span>
                </h2>
                
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12">
                  <Link href="/register" className="group relative">
                    <div className="absolute -inset-1 bg-white rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                    <Button 
                      size="lg" 
                      className="relative bg-white text-blue-600 hover:bg-blue-50 text-xl px-14 h-20 font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-0"
                    >
                      Get Started Free
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="text-xl px-10 h-20 font-bold border-3 border-white/40 hover:border-white/60 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 text-white"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Building2 className="h-10 w-10 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-950"></div>
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  OnPoints.it
                </span>
              </div>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                The modern IT support management platform trusted by teams worldwide. 
                Built with performance, security, and user experience in mind.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                  Status:
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-600">All systems operational</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5 text-lg">Product</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="/features" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Features</a></li>
                <li><a href="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Pricing</a></li>
                <li><a href="/security" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Security</a></li>
                <li><a href="/roadmap" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Roadmap</a></li>
                <li><a href="/changelog" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5 text-lg">Support</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="/docs" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Documentation</a></li>
                <li><a href="/guides" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Guides</a></li>
                <li><a href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Contact Us</a></li>
                <li><a href="/status" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Status</a></li>
                <li><a href="/help" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Help Center</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5 text-lg">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="/about" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">About</a></li>
                <li><a href="/press" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Press Kit</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center lg:text-left">
                © 2025 <span className="font-bold">OnPoints.it</span> ServiceDesk. All rights reserved. 
                <span className="ml-2">Made with ❤️ for IT teams worldwide</span>
              </p>
              <div className="flex items-center gap-8 text-sm">
                <a href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Terms</a>
                <a href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Privacy</a>
                <a href="/cookies" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Cookies</a>
                <a href="/legal" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Legal</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

