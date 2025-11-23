"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, UserPlus, Building2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  MODULE_METADATA, 
  type FeatureFlag,
  MODULE_PLAN_REQUIREMENTS,
} from "@/lib/feature-flags";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  subdomain: string | null;
  createdAt: string;
  settings?: {
    modules?: Record<FeatureFlag, boolean>;
  };
}

interface TenantAdmin {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export default function EditOrgAdminPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [admins, setAdmins] = useState<TenantAdmin[]>([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    domain: "",
    subdomain: "",
  });
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [subdomainInput, setSubdomainInput] = useState("");
  const [subdomainVerified, setSubdomainVerified] = useState(false);
  const [subdomainVerificationToken, setSubdomainVerificationToken] = useState<string | null>(null);
  const [isSavingSubdomain, setIsSavingSubdomain] = useState(false);
  const [isRemovingSubdomain, setIsRemovingSubdomain] = useState(false);
  const [isVerifyingSubdomain, setIsVerifyingSubdomain] = useState(false);
  const [modules, setModules] = useState<Record<FeatureFlag, boolean>>({} as Record<FeatureFlag, boolean>);
  const [updatingModules, setUpdatingModules] = useState<Set<FeatureFlag>>(new Set());
  
  // Add admin form state
  const [addAdminData, setAddAdminData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TENANT_ADMIN",
  });
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  // Check that user is global super admin
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "ADMIN" || session.user.tenantId) {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/tenants/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch tenant");
        const data = await response.json();
        setTenant(data);
        setFormData({
          name: data.name,
          slug: data.slug,
          domain: data.domain || "",
          subdomain: data.subdomain || "",
        });
        setSubdomain(data.subdomain || null);
        setSubdomainInput(data.subdomain || "");
        
        // Fetch subdomain verification status
        const subdomainResponse = await fetch(`/api/tenants/${params.id}/subdomain`);
        if (subdomainResponse.ok) {
          const subdomainData = await subdomainResponse.json();
          setSubdomainVerified(subdomainData.verified || false);
          setSubdomainVerificationToken(subdomainData.verificationToken || null);
        }
        
        // Load modules
        const modulesResponse = await fetch(`/api/tenants/${params.id}/modules`);
        if (modulesResponse.ok) {
          const modulesData = await modulesResponse.json();
          setModules(modulesData.modules || {});
        }

        // Load admins
        const adminsResponse = await fetch(`/api/admin/users?tenantId=${params.id}`);
        if (adminsResponse.ok) {
          const adminsData = await adminsResponse.json();
          setAdmins(adminsData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error loading data");
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/tenants/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          domain: formData.domain.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = data.details ? 
          `${data.error}: ${data.details.map((d: any) => d.message).join(", ")}` :
          data.error;
        throw new Error(errorMessage || "Failed to update tenant");
      }

      toast.success("Organization successfully updated");
      router.push("/admin/organizations");
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleModuleToggle = async (module: FeatureFlag, enabled: boolean) => {
    setModules(prev => ({ ...prev, [module]: enabled }));
    setUpdatingModules(prev => new Set(prev).add(module));

    try {
      const response = await fetch(`/api/tenants/${params.id}/modules`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          modules: { [module]: enabled }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update module");
      }

      const data = await response.json();
      setModules(data.modules);
      
      toast.success(
        enabled 
          ? `Module "${MODULE_METADATA[module].name}" enabled`
          : `Module "${MODULE_METADATA[module].name}" disabled`
      );
    } catch (error: any) {
      setModules(prev => ({ ...prev, [module]: !enabled }));
      toast.error("Failed to update module");
    } finally {
      setUpdatingModules(prev => {
        const newSet = new Set(prev);
        newSet.delete(module);
        return newSet;
      });
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingAdmin(true);

    try {
      const response = await fetch(`/api/tenants/${params.id}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addAdminData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create administrator");
      }

      toast.success("Administrator created successfully");
      setShowAddAdmin(false);
      setAddAdminData({ name: "", email: "", password: "", role: "TENANT_ADMIN" });
      
      // Reload admins list
      const adminsResponse = await fetch(`/api/admin/users?tenantId=${params.id}`);
      if (adminsResponse.ok) {
        const adminsData = await adminsResponse.json();
        setAdmins(adminsData || []);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAddingAdmin(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="text-center py-12">
          <p className="text-neutral-400">Organization not found</p>
          <Button onClick={() => router.back()} className="mt-4 bg-white text-black">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const modulesList = Object.keys(MODULE_METADATA) as FeatureFlag[];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-neutral-400 hover:text-white hover:bg-neutral-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-2">
              {tenant.name}
            </h1>
            <p className="text-neutral-400 font-light">
              Organization management
            </p>
          </div>
        </div>

        <Tabs defaultValue="info" className="space-y-8">
          <TabsList className="bg-neutral-950 border border-neutral-900">
            <TabsTrigger value="info" className="data-[state=active]:bg-neutral-900 text-neutral-400 data-[state=active]:text-white">
              General
            </TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-neutral-900 text-neutral-400 data-[state=active]:text-white">
              Modules
            </TabsTrigger>
            <TabsTrigger value="admins" className="data-[state=active]:bg-neutral-900 text-neutral-400 data-[state=active]:text-white">
              Administrators
            </TabsTrigger>
          </TabsList>

          {/* Tab: General Information */}
          <TabsContent value="info">
            <div className="p-6 rounded-lg border border-neutral-900 bg-neutral-950/50">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-neutral-300">Organization Name *</Label>
                    <Input
                      id="name"
                      placeholder="Company name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      disabled={isSaving}
                      className="bg-black border-neutral-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-neutral-300">Slug (Identifier) *</Label>
                    <Input
                      id="slug"
                      placeholder="company-slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      required
                      disabled={isSaving}
                      className="bg-black border-neutral-800 text-white font-mono"
                    />
                    <p className="text-xs text-neutral-600 font-mono">
                      Used in URL. Lowercase letters, numbers and hyphens only
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain" className="text-neutral-300">Domain (optional)</Label>
                    <Input
                      id="domain"
                      placeholder="company.com"
                      value={formData.domain}
                      onChange={(e) =>
                        setFormData({ ...formData, domain: e.target.value })
                      }
                      disabled={isSaving}
                      className="bg-black border-neutral-800 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subdomain" className="text-neutral-300">
                      Subdomain (optional)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="subdomain"
                        placeholder={tenant?.domain ? `help.${tenant.domain}` : "help.example.com"}
                        value={subdomainInput}
                        onChange={(e) => setSubdomainInput(e.target.value)}
                        disabled={isSavingSubdomain || isRemovingSubdomain}
                        className="bg-black border-neutral-800 text-white font-mono flex-1"
                      />
                      {subdomain ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={async () => {
                              setIsSavingSubdomain(true);
                              try {
                                const response = await fetch(
                                  `/api/tenants/${params.id}/subdomain`,
                                  {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ subdomain: subdomainInput }),
                                  }
                                );
                                if (!response.ok) {
                                  const data = await response.json();
                                  throw new Error(data.error || "Failed to save subdomain");
                                }
                                const data = await response.json();
                                setSubdomain(data.subdomain);
                                setSubdomainInput(data.subdomain);
                                setSubdomainVerified(data.verified || false);
                                setSubdomainVerificationToken(data.verificationToken || null);
                                toast.success("Subdomain updated successfully. Please verify DNS to activate it.");
                              } catch (error: any) {
                                toast.error(error.message);
                              } finally {
                                setIsSavingSubdomain(false);
                              }
                            }}
                            disabled={isSavingSubdomain || subdomainInput === subdomain}
                            className="border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white"
                          >
                            {isSavingSubdomain ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Update"
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={async () => {
                              setIsRemovingSubdomain(true);
                              try {
                                const response = await fetch(
                                  `/api/tenants/${params.id}/subdomain`,
                                  {
                                    method: "DELETE",
                                  }
                                );
                                if (!response.ok) {
                                  const data = await response.json();
                                  throw new Error(data.error || "Failed to remove subdomain");
                                }
                                setSubdomain(null);
                                setSubdomainInput("");
                                setSubdomainVerified(false);
                                setSubdomainVerificationToken(null);
                                toast.success("Subdomain removed successfully");
                              } catch (error: any) {
                                toast.error(error.message);
                              } finally {
                                setIsRemovingSubdomain(false);
                              }
                            }}
                            disabled={isRemovingSubdomain}
                            className="border-neutral-800 text-red-400 hover:bg-red-950/20 hover:text-red-300"
                          >
                            {isRemovingSubdomain ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Removing...
                              </>
                            ) : (
                              "Remove"
                            )}
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={async () => {
                            setIsSavingSubdomain(true);
                            try {
                              const response = await fetch(
                                `/api/tenants/${params.id}/subdomain`,
                                {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ subdomain: subdomainInput }),
                                }
                              );
                              if (!response.ok) {
                                const data = await response.json();
                                throw new Error(data.error || "Failed to set subdomain");
                              }
                                const data = await response.json();
                                setSubdomain(data.subdomain);
                                setSubdomainInput(data.subdomain);
                                setSubdomainVerified(data.verified || false);
                                setSubdomainVerificationToken(data.verificationToken || null);
                                toast.success("Subdomain set successfully. Please verify DNS to activate it.");
                            } catch (error: any) {
                              toast.error(error.message);
                            } finally {
                              setIsSavingSubdomain(false);
                            }
                          }}
                          disabled={isSavingSubdomain || !subdomainInput.trim()}
                          className="border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white"
                        >
                          {isSavingSubdomain ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Setting...
                            </>
                          ) : (
                            "Set"
                          )}
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 font-mono">
                      Full subdomain (e.g., {tenant?.domain ? `help.${tenant.domain}` : "help.example.com"}). Users can access your organization via this domain.
                    </p>
                    {subdomain && !subdomainVerified && subdomainVerificationToken && (
                      <div className="mt-3 p-3 bg-yellow-950/20 border border-yellow-900 rounded-md">
                        <p className="text-xs font-medium text-yellow-300 mb-2">
                          DNS Verification Required
                        </p>
                        <p className="text-xs text-yellow-400 mb-2">
                          Add the following TXT record to your DNS:
                        </p>
                        <div className="bg-black p-2 rounded border border-yellow-900 mb-2">
                          <p className="text-xs font-mono text-yellow-200">
                            Host: <strong>_onpoints-verify.{subdomain.split('.').slice(-2).join('.')}</strong>
                          </p>
                          <p className="text-xs font-mono text-yellow-200 break-all">
                            Value: <strong>{subdomainVerificationToken}</strong>
                          </p>
                        </div>
                        <p className="text-xs text-yellow-400 mb-2">
                          After adding the DNS record, wait a few minutes for propagation, then click "Verify DNS".
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            setIsVerifyingSubdomain(true);
                            try {
                              const response = await fetch(
                                `/api/tenants/${params.id}/subdomain/verify`,
                                {
                                  method: "PUT",
                                }
                              );
                              if (!response.ok) {
                                const data = await response.json();
                                throw new Error(data.error || "DNS verification failed");
                              }
                              const data = await response.json();
                              if (data.verified) {
                                setSubdomainVerified(true);
                                toast.success("DNS verified successfully! Subdomain is now active.");
                              } else {
                                toast.error("DNS verification failed. Please check your DNS settings.");
                              }
                            } catch (error: any) {
                              toast.error(error.message || "DNS verification failed");
                            } finally {
                              setIsVerifyingSubdomain(false);
                            }
                          }}
                          disabled={isVerifyingSubdomain}
                          className="border-yellow-800 text-yellow-300 hover:bg-yellow-900/30"
                        >
                          {isVerifyingSubdomain ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify DNS"
                          )}
                        </Button>
                      </div>
                    )}
                    {subdomain && subdomainVerified && (
                      <div className="mt-2 p-2 bg-green-950/20 border border-green-900 rounded-md">
                        <p className="text-xs text-green-400 font-mono">
                          ✅ Verified: {subdomain} is active and ready to use
                        </p>
                      </div>
                    )}
                  </div>
                  {error && (
                    <div className="text-sm text-red-400 bg-red-950/50 border border-red-900 p-3 rounded-md font-mono">
                      {error}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-neutral-900">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSaving}
                    className="border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-white text-black hover:bg-neutral-200 font-bold"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

          {/* Tab: Modules */}
          <TabsContent value="modules">
            <div className="grid gap-4 md:grid-cols-2">
              {modulesList.map((moduleKey) => {
                const module = MODULE_METADATA[moduleKey];
                const isEnabled = modules[moduleKey] === true;
                const isUpdating = updatingModules.has(moduleKey);
                const requiredPlan = MODULE_PLAN_REQUIREMENTS[moduleKey];

                return (
                  <div
                    key={moduleKey}
                    className={`group relative p-5 rounded-lg border transition-all duration-150 ${
                      isEnabled 
                        ? "border-green-500/20 bg-green-950/10" 
                        : "border-neutral-900 bg-neutral-950/50"
                    }`}
                  >
                    {isEnabled && (
                      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-green-500"></div>
                    )}
                    <div className="pt-2">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{module.icon}</span>
                            <h3 className="font-bold text-white text-sm">
                              {module.name}
                            </h3>
                            {module.comingSoon && (
                              <Badge className="text-[10px] font-mono bg-neutral-900 text-neutral-500">
                                SOON
                              </Badge>
                            )}
                            <Badge className="text-[10px] font-mono bg-neutral-900 text-neutral-500">
                              {requiredPlan}
                            </Badge>
                          </div>
                          <p className="text-xs text-neutral-500 font-light leading-relaxed">
                            {module.description}
                          </p>
                        </div>
                        <div className="ml-4">
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) =>
                              handleModuleToggle(moduleKey, checked)
                            }
                            disabled={isUpdating || module.comingSoon}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Tab: Administrators */}
          <TabsContent value="admins">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Administrators</h2>
                  <p className="text-neutral-400 text-sm">
                    Manage organization administrators
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddAdmin(true)}
                  className="bg-white text-black hover:bg-neutral-200 font-bold border border-neutral-800"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </div>

              {admins.length === 0 ? (
                <div className="border border-neutral-900 rounded-lg p-12 text-center bg-neutral-950/50">
                  <UserPlus className="mx-auto h-16 w-16 text-neutral-700 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Administrators</h3>
                  <p className="text-neutral-400 mb-6 max-w-md mx-auto">
                    Add an administrator to manage this organization
                  </p>
                  <Button
                    onClick={() => setShowAddAdmin(true)}
                    className="bg-white text-black hover:bg-neutral-200"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Administrator
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="group relative p-5 rounded-lg border border-neutral-900 bg-neutral-950/50 hover:bg-neutral-900/50 hover:border-neutral-800 transition-all duration-150"
                    >
                      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-green-500/20 group-hover:bg-green-500/40 transition-colors"></div>
                      <div className="pt-4 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg border border-neutral-800 bg-black">
                              <Building2 className="h-5 w-5 text-neutral-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-white truncate mb-1">
                                {admin.name || admin.email}
                              </h3>
                              <p className="text-xs text-neutral-500 font-mono truncate">
                                {admin.email}
                              </p>
                            </div>
                            <Badge className="bg-neutral-900 text-neutral-500 text-xs font-mono">
                              {admin.role === "TENANT_ADMIN" ? "ADMIN" : admin.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Admin Dialog */}
      <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
        <DialogContent className="bg-neutral-950 border-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Administrator</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Create a new administrator for this organization
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddAdmin}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name" className="text-neutral-300">Name *</Label>
                <Input
                  id="admin-name"
                  placeholder="First Last"
                  value={addAdminData.name}
                  onChange={(e) =>
                    setAddAdminData({ ...addAdminData, name: e.target.value })
                  }
                  required
                  disabled={isAddingAdmin}
                  className="bg-black border-neutral-800 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-neutral-300">Email *</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@company.com"
                  value={addAdminData.email}
                  onChange={(e) =>
                    setAddAdminData({ ...addAdminData, email: e.target.value })
                  }
                  required
                  disabled={isAddingAdmin}
                  className="bg-black border-neutral-800 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-neutral-300">Password *</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={addAdminData.password}
                  onChange={(e) =>
                    setAddAdminData({ ...addAdminData, password: e.target.value })
                  }
                  required
                  disabled={isAddingAdmin}
                  className="bg-black border-neutral-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-role" className="text-neutral-300">Role *</Label>
                <Select
                  value={addAdminData.role}
                  onValueChange={(value) =>
                    setAddAdminData({ ...addAdminData, role: value })
                  }
                  disabled={isAddingAdmin}
                >
                  <SelectTrigger className="bg-black border-neutral-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-neutral-800">
                    <SelectItem value="TENANT_ADMIN">Organization Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddAdmin(false)}
                disabled={isAddingAdmin}
                className="border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isAddingAdmin}
                className="bg-white text-black hover:bg-neutral-200 font-bold"
              >
                {isAddingAdmin ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

