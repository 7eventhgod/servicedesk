"use client";

import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="min-h-screen bg-neutral-950 admin-dark-theme">
        <DashboardHeader 
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
          mobileMenuOpen={mobileMenuOpen}
        />
        <div className="flex border-t border-neutral-800">
          <AdminSidebar 
            mobileMenuOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-x-hidden bg-neutral-950 text-neutral-100">
            {children}
          </main>
        </div>
        
        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>
    </SessionProvider>
  );
}

