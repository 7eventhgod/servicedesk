import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const hostname = req.headers.get("host") || "";

    // Определяем тенанта по домену и добавляем заголовки для дальнейшего использования
    const requestHeaders = new Headers(req.headers);
    
    // Проверяем, если это кастомный домен (не основной домен платформы)
    if (hostname && 
        !hostname.includes("localhost") && 
        !hostname.includes("127.0.0.1") &&
        !hostname.includes("onpoints.it")) {
      // Передаем hostname для определения тенанта в server components/API
      requestHeaders.set("x-tenant-hostname", hostname);
      
      // Если есть заголовок от Nginx для кастомного домена, тоже передаем
      const customDomain = req.headers.get("x-custom-domain");
      if (customDomain) {
        requestHeaders.set("x-custom-domain", customDomain);
      }
    }

    // Redirect to dashboard if authenticated and trying to access /login
    if (path === "/login" && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Check access rights for admin routes
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Public pages (including homepage)
        if (path === "/" || path === "/login" || path === "/register") {
          return true;
        }

        // API routes for support tickets
        if (path.startsWith("/api/support-tickets")) {
          return !!token && (token.role === "ADMIN" || token.role === "TENANT_ADMIN");
        }

        // All other pages require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/tickets/:path*", "/login"],
  // Homepage (/) is accessible without authentication
};

