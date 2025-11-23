"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  Ticket, 
  Activity,
  Shield,
  Database,
  TrendingUp,
  Settings
} from "lucide-react";

interface AdminStats {
  totalTenants: number;
  totalUsers: number;
  totalTickets: number;
  totalAgents: number;
  activeTenants: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    
    // Only for global super-admins (without tenantId)
    if (!session || session.user.role !== "ADMIN" || session.user.tenantId) {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    if (!session || session.user.role !== "ADMIN" || session.user.tenantId) return;

    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [session]);

  if (status === "loading" || isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-muted-foreground mt-2">
              Global system management
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Organizations",
      value: stats?.totalTenants || 0,
      icon: <Building2 className="h-8 w-8 text-blue-600" />,
      description: `${stats?.activeTenants || 0} active`,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <Users className="h-8 w-8 text-green-600" />,
      description: `${stats?.totalAgents || 0} agents`,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Total Tickets",
      value: stats?.totalTickets || 0,
      icon: <Ticket className="h-8 w-8 text-purple-600" />,
      description: "All time",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "System",
      value: "Online",
      icon: <Activity className="h-8 w-8 text-emerald-600" />,
      description: "All services operational",
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  const adminActions = [
    {
      title: "Support Tickets",
      description: "Requests from organization administrators",
      icon: <Activity className="h-10 w-10" />,
      href: "/admin/support-tickets",
      color: "from-red-500 to-orange-600"
    },
    {
      title: "Manage Organizations",
      description: "View, edit and delete tenants",
      icon: <Building2 className="h-10 w-10" />,
      href: "/admin/organizations",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Organization Groups",
      description: "Group organizations for joint management",
      icon: <Users className="h-10 w-10" />,
      href: "/admin/tenant-groups",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "Manage Modules",
      description: "Enable and disable features for tenants",
      icon: <Settings className="h-10 w-10" />,
      href: "/admin/modules",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Tenant Administrators",
      description: "Manage organization administrators",
      icon: <Users className="h-10 w-10" />,
      href: "/admin/users",
      color: "from-green-500 to-green-600"
    },
    {
      title: "System & Database",
      description: "Monitoring, backups and technical information",
      icon: <Database className="h-10 w-10" />,
      href: "/admin/system",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Tech Hero */}
      <div className="relative overflow-hidden border-b border-neutral-900">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative px-8 pt-20 pb-16 max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 mb-8">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="w-1 h-1 rounded-full bg-green-500/50"></div>
                  <div className="w-0.5 h-0.5 rounded-full bg-green-500/30"></div>
                </div>
                <span className="text-[10px] font-mono font-bold text-green-400 uppercase tracking-[0.2em]">
                  SYSTEM_ADMIN
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 font-mono">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-300 to-neutral-600">
                  ./ADMIN
                </span>
              </h1>
              <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed font-light">
                Execute administrative commands. Manage system infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stats */}
      <div className="px-8 py-12 max-w-7xl mx-auto">
        <div className="grid gap-3 md:grid-cols-4 mb-20">
          {statCards.map((stat, index) => (
            <div 
              key={index} 
              className="group relative cursor-pointer p-6 rounded-lg border border-neutral-900 bg-neutral-950/50 hover:bg-neutral-900/50 hover:border-neutral-800 transition-all duration-150"
            >
              {/* Terminal effect */}
              <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-green-500/20 group-hover:bg-green-500/40 transition-colors"></div>
              
              <div className="flex items-start justify-between mb-4 pt-2">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wide">
                  {stat.title}
                </span>
                <div className="text-neutral-800 group-hover:text-neutral-600 transition-colors">
                  {stat.icon}
                </div>
              </div>
              <div className="text-4xl font-bold font-mono text-white mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Tech Modules */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-green-500 to-transparent"></div>
            <h2 className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-[0.3em]">
              /MODULES
            </h2>
          </div>
          
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {adminActions.map((action, index) => (
              <div
                key={index}
                className="group relative p-5 rounded-lg border border-neutral-900 bg-neutral-950/50 hover:bg-neutral-900/50 hover:border-neutral-800 cursor-pointer transition-all duration-150"
                onClick={() => router.push(action.href)}
              >
                {/* Terminal cursor */}
                <div className="absolute top-3 left-3 w-1.5 h-4 bg-green-500/0 group-hover:bg-green-500 transition-all duration-150"></div>
                
                <div className="flex items-start gap-4 mb-3 pt-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded border border-neutral-800 bg-black group-hover:border-neutral-700 group-hover:bg-neutral-950 transition-colors">
                    {React.cloneElement(action.icon, { 
                      className: "h-5 w-5 text-neutral-600"
                    })}
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-green-400 transition-colors font-mono">
                  {action.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 font-light">
                  {action.description}
                </p>
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-green-400 font-mono text-xs">{'>'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Warning */}
        <div className="mt-20 relative p-6 rounded-lg border border-orange-900 bg-orange-950/10">
          {/* Scan line effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse"></div>
          
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded border border-orange-900 bg-orange-950/20">
                <Shield className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-orange-400 mb-2 font-mono">
                [WARNING] ROOT ACCESS
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-light">
                Full system privileges enabled. All actions are logged to /var/log/audit.log
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

