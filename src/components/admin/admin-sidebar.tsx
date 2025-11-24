"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Crown,
  HelpCircle,
  Building2,
  Users,
  Settings,
  Database,
  MessageCircle,
  Activity,
  HardDrive,
  Zap,
  Webhook,
  Shield,
  LogOut,
  ArrowLeft,
} from "lucide-react";

const adminMenuItems = [
  {
    label: "Admin Panel",
    href: "/admin",
    icon: Crown,
  },
  {
    label: "Support Tickets",
    href: "/admin/support-tickets",
    icon: HelpCircle,
  },
  {
    label: "Organizations",
    href: "/admin/organizations",
    icon: Building2,
  },
  {
    label: "Organization Groups",
    href: "/admin/tenant-groups",
    icon: Users,
  },
  {
    label: "Tenant Administrators",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "System & Database",
    href: "/admin/system",
    icon: Database,
  },
];

const globalModules = [
  {
    label: "Modules",
    href: "/admin/modules",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  mobileMenuOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobileMenuOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [supportUnreadCount, setSupportUnreadCount] = useState(0);
  const [shouldBounceSupport, setShouldBounceSupport] = useState(false);

  // Check if user is super admin (ADMIN without tenantId)
  const isSuperAdmin = session?.user?.role === "ADMIN" && !session?.user?.tenantId;

  // Function to fetch support ticket counter (for super admin)
  const fetchSupportUnreadCount = () => {
    if (!isSuperAdmin) {
      setSupportUnreadCount(0);
      return;
    }
    
    fetch("/api/support-tickets/unread-count")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const newCount = data.count || 0;
        
        setSupportUnreadCount((prevCount) => {
          if (newCount !== prevCount) {
            // Trigger bounce animation only if counter increased
            if (newCount > prevCount) {
              setShouldBounceSupport(true);
              setTimeout(() => setShouldBounceSupport(false), 1000);
            }
            return newCount;
          }
          return prevCount;
        });
      })
      .catch((error) => {
        console.error("Error fetching support unread count:", error);
        setSupportUnreadCount(0);
      });
  };

  // Initial load and polling of support tickets (for super admin)
  useEffect(() => {
    if (isSuperAdmin) {
      // Fetch immediately
      fetchSupportUnreadCount();
      // Then poll every 10 seconds
      const interval = setInterval(fetchSupportUnreadCount, 10000);
      return () => clearInterval(interval);
    } else {
      setSupportUnreadCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Update support ticket counter when route changes
  useEffect(() => {
    if (isSuperAdmin && pathname.startsWith("/admin/support-tickets")) {
      const timeout = setTimeout(() => {
        fetchSupportUnreadCount();
      }, 500);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, session]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-56 border-r border-neutral-800 min-h-[calc(100vh-4rem)] bg-neutral-950">
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Admin Menu */}
          <div className="mb-6">
            <div className="px-3 py-2 mb-3">
              <div className="h-px w-full bg-gradient-to-r from-green-500 via-neutral-700 to-transparent"></div>
            </div>
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 relative group",
                    isActive
                      ? "bg-neutral-900 text-white font-bold border border-neutral-700"
                      : "text-neutral-300 hover:bg-neutral-900 hover:text-white font-medium border border-transparent hover:border-neutral-700"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                  
                  {/* Badge for unread support tickets */}
                  {item.href === "/admin/support-tickets" && supportUnreadCount > 0 && (
                    <span 
                      key={`support-badge-${supportUnreadCount}`}
                      className={cn(
                        "ml-auto flex items-center justify-center rounded-full bg-red-600 text-white text-[11px] font-bold px-2 h-5 min-w-[20px] shadow-sm",
                        supportUnreadCount > 9 ? "min-w-[24px]" : "",
                        shouldBounceSupport ? "animate-notification-bounce" : ""
                      )}
                    >
                      {supportUnreadCount > 99 ? "99+" : supportUnreadCount}
                    </span>
                  )}
                  
                  {/* Terminal dot indicator */}
                  {isActive && supportUnreadCount === 0 && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Global Modules */}
          <div className="pt-3 border-t border-neutral-800">
            <div className="px-3 py-2 mb-3">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.3em]">
                GLOBAL
              </span>
            </div>
            {globalModules.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 relative group",
                    isActive
                      ? "bg-neutral-900 text-white font-bold border border-neutral-700"
                      : "text-neutral-300 hover:bg-neutral-900 hover:text-white font-medium border border-transparent hover:border-neutral-700"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                  
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Admin Info - Absolute at bottom */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950 space-y-2">
          <div className="px-3 py-2 rounded-lg border border-neutral-900 bg-neutral-950/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-mono font-bold text-green-400 uppercase tracking-wide">
                ROOT
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono">
              Full system access
            </p>
          </div>
          
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-600 transition-all duration-150 text-neutral-300 hover:text-white group"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold font-mono">Exit Admin</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside 
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-neutral-950 border-r border-neutral-800 transition-transform duration-300",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-neutral-800">
            <h2 className="text-sm font-bold font-mono text-white">./ADMIN</h2>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {[...adminMenuItems, ...globalModules].map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                    isActive
                      ? "bg-neutral-900 text-white font-bold"
                      : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                  
                  {/* Badge for unread support tickets (mobile) */}
                  {item.href === "/admin/support-tickets" && supportUnreadCount > 0 && (
                    <span 
                      key={`support-badge-mobile-${supportUnreadCount}`}
                      className={cn(
                        "ml-auto flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold px-2 h-5 min-w-[20px]",
                        supportUnreadCount > 9 ? "min-w-[24px]" : "",
                        shouldBounceSupport ? "animate-notification-bounce" : ""
                      )}
                    >
                      {supportUnreadCount > 99 ? "99+" : supportUnreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Mobile exit button */}
          <div className="p-3 border-t border-neutral-900">
            <button
              onClick={() => {
                router.push("/dashboard");
                onClose?.();
              }}
              className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950/50 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-150 text-neutral-400 hover:text-white group flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold font-mono">Exit Admin</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

