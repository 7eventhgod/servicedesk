"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Building2, RefreshCw, Eye, EyeOff, Shield, CheckCircle, Copy } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [registeredCredentials, setRegisteredCredentials] = useState({ email: "", password: "" });
  const [formData, setFormData] = useState({
    tenantName: "",
    tenantSlug: "",
    tenantDomain: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleTenantSlugChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    
    setFormData({ ...formData, tenantName: value, tenantSlug: slug });
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    setFormData({ ...formData, password: password, confirmPassword: password });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenantName || !formData.tenantSlug) {
      setError("Fill in all fields");
      return;
    }
    generatePassword();
    setStep(2);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const requestData = {
        tenantName: formData.tenantName,
        tenantSlug: formData.tenantSlug,
        tenantDomain: formData.tenantDomain || null,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create organization");
      }

      setRegisteredCredentials({ email: formData.email, password: formData.password });
      setShowSuccessDialog(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
      </div>

      <header className="absolute top-0 left-0 right-0 z-50 border-b bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm">
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

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10 pt-32 pb-24">
        <Card className="max-w-md w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-slate-200 dark:border-slate-800">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Registration
            </CardTitle>
            <CardDescription>
              Create a new organization and get access to the system
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 ? (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantName" className="text-sm font-semibold">
                    Organization Name *
                  </Label>
                  <Input
                    id="tenantName"
                    placeholder="Your company name"
                    value={formData.tenantName}
                    onChange={(e) => handleTenantSlugChange(e.target.value)}
                    className="py-3"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenantSlug" className="text-sm font-semibold">
                    Organization Identifier *
                  </Label>
                  <Input
                    id="tenantSlug"
                    placeholder="company-slug"
                    value={formData.tenantSlug}
                    onChange={(e) =>
                      setFormData({ ...formData, tenantSlug: e.target.value })
                    }
                    className="py-3"
                    required
                    disabled={isLoading}
                  />
                  <p className="text-xs text-slate-500">
                    Used in URL. Only lowercase letters, numbers, and hyphens
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenantDomain" className="text-sm font-semibold">
                    Domain (optional)
                  </Label>
                  <Input
                    id="tenantDomain"
                    placeholder="company.com"
                    value={formData.tenantDomain}
                    onChange={(e) =>
                      setFormData({ ...formData, tenantDomain: e.target.value })
                    }
                    className="py-3"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="text-sm p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 border-0"
                  disabled={isLoading}
                >
                  Next
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="First Last"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="py-3"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="py-3"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold">
                      Administrator Password *
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generatePassword}
                      className="transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                      disabled={isLoading}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Generate
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="py-3 pr-10"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Password will be automatically generated. You can change it or use the generated one.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="py-3"
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="text-sm p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 border-0"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Organization"
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link href="/login">
                  <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700 dark:hover:text-blue-400">
                    Sign In
                  </Button>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Credential Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-full bg-white/20 p-2">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Organization Created!</h3>
                  <p className="text-green-50 text-sm">Your account has been successfully registered</p>
                </div>
              </div>
            </div>

            {/* Credentials Content */}
            <div className="p-6 space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                      Important: Save Your Credentials
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Please copy and securely store these credentials. You'll need them to log in.
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    value={registeredCredentials.email}
                    readOnly
                    className="font-mono text-sm bg-slate-50 dark:bg-slate-800"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(registeredCredentials.email);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</Label>
                <div className="flex gap-2">
                  <Input
                    value={registeredCredentials.password}
                    readOnly
                    className="font-mono text-sm bg-slate-50 dark:bg-slate-800"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(registeredCredentials.password);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 h-12 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  onClick={() => {
                    setShowSuccessDialog(false);
                    router.push("/login?message=registration-success");
                  }}
                >
                  Go to Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
