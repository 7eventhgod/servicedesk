"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { LogOut, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export function DashboardHeader({ onMenuToggle, mobileMenuOpen }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const getRoleLabel = () => {
    switch (session?.user.role) {
      case "ADMIN": return "Administrator";
      case "TENANT_ADMIN": return "Organization Admin";
      case "AGENT": return "Agent";
      case "USER": return "User";
      default: return "";
    }
  };

  const isAdmin = session?.user.role === "ADMIN" && !session?.user.tenantId;
  const pathIsAdmin = pathname?.startsWith("/admin");

  return (
    <header className={cn(
      "sticky top-0 z-30 backdrop-blur-xl",
      pathIsAdmin
        ? "bg-black/80 border-b border-neutral-900"
        : "bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-900"
    )}>
      <div className="flex h-16 items-center px-6 justify-between">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden -ml-2",
              pathIsAdmin 
                ? "text-neutral-400 hover:text-white hover:bg-neutral-900"
                : "text-slate-500"
            )}
            onClick={onMenuToggle}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          
          <div className="flex items-center gap-3">
            <h1 className={cn(
              "text-base font-bold tracking-tight",
              pathIsAdmin ? "font-mono text-white" : "text-primary"
            )}>
              ServiceDesk
            </h1>
            {isAdmin && (
              <span className={cn(
                "hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded",
                pathIsAdmin
                  ? "border border-green-500/20 bg-green-500/10"
                  : "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900"
              )}>
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full bg-green-500",
                  pathIsAdmin ? "animate-pulse" : ""
                )}></div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  pathIsAdmin
                    ? "font-mono text-green-400"
                    : "text-emerald-700 dark:text-emerald-400"
                )}>
                  {pathIsAdmin ? "ROOT" : "Admin"}
                </span>
              </span>
            )}
          </div>
          {session?.user.tenantSlug && (
            <span className={cn(
              "hidden sm:inline text-xs",
              pathIsAdmin ? "text-neutral-500 font-mono" : "text-slate-500 font-medium"
            )}>
              {pathIsAdmin ? "@" : ""}{session.user.tenantSlug}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className={cn(
                "text-sm font-bold",
                pathIsAdmin ? "text-white" : ""
              )}>{session?.user.name || session?.user.email}</p>
              <p className={cn(
                "text-xs font-medium",
                pathIsAdmin ? "text-neutral-500 font-mono" : "text-slate-500"
              )}>
                {getRoleLabel()}
              </p>
            </div>
            <Avatar className={cn(
              "border-2",
              pathIsAdmin ? "border-neutral-800" : "border-slate-200 dark:border-slate-800"
            )}>
              <AvatarImage src={session?.user.image || undefined} />
              <AvatarFallback className={cn(
                "text-xs font-bold",
                pathIsAdmin ? "bg-neutral-900 text-white" : "bg-slate-50 dark:bg-slate-900"
              )}>
                {session?.user.name ? getInitials(session.user.name) : "UN"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={pathIsAdmin ? "text-neutral-500 hover:text-white hover:bg-neutral-900" : ""}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8 border border-neutral-800">
                  <AvatarImage src={session?.user.image || undefined} />
                  <AvatarFallback className="text-xs bg-neutral-900">
                    {session?.user.name ? getInitials(session.user.name) : "UN"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="text-sm font-medium">{session?.user.name || session?.user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">{getRoleLabel()}</p>
                  {session?.user.tenantSlug && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Tenant: {session.user.tenantSlug}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

