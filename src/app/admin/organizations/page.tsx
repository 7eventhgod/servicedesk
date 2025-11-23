"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Users, Ticket, Trash2, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  createdAt: string;
  group: {
    id: string;
    name: string;
  } | null;
  _count: {
    users: number;
    tickets: number;
  };
}

export default function AdminOrganizationsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [orgFormData, setOrgFormData] = useState({
    name: "",
    slug: "",
    domain: "",
  });

  // Check that user is global admin
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "ADMIN" || session.user.tenantId) {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    async function fetchTenants() {
      if (!session || session.user.role !== "ADMIN" || session.user.tenantId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/tenants");
        if (!response.ok) throw new Error("Failed to fetch tenants");
        const data = await response.json();
        setTenants(data);
      } catch (error) {
        console.error("Error fetching tenants:", error);
        toast.error("Failed to load organizations");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTenants();
  }, [session]);

  const handleSlugChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    
    setOrgFormData({ ...orgFormData, name: value, slug });
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingOrg(true);

    try {
      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orgFormData.name,
          slug: orgFormData.slug,
          domain: orgFormData.domain.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = data.details ? 
          `${data.error}: ${data.details.map((d: any) => d.message).join(", ")}` :
          data.error;
        throw new Error(errorMessage || "Failed to create organization");
      }

      toast.success("Organization created successfully");
      setShowAddOrg(false);
      setOrgFormData({ name: "", slug: "", domain: "" });
      
      // Reload tenants list
      const tenantsResponse = await fetch("/api/tenants");
      if (tenantsResponse.ok) {
        const tenantsData = await tenantsResponse.json();
        setTenants(tenantsData);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCreatingOrg(false);
    }
  };

  const handleDeleteTenant = async (tenantId: string, tenantName: string) => {
    if (!confirm(`Are you sure you want to delete the organization "${tenantName}"? This action is irreversible!`)) {
      return;
    }

    try {
      const response = await fetch(`/api/tenants/${tenantId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmation: "DELETE" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete tenant");
      }

      toast.success("Organization successfully deleted!");
      setTenants(tenants.filter((t) => t.id !== tenantId));
    } catch (error: any) {
      console.error("Error deleting tenant:", error);
      toast.error(error.message || "Failed to delete organization");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Organizations
            </h1>
            <p className="text-neutral-400 font-light">
              Manage all platform organizations
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border-neutral-900 bg-neutral-950">
              <CardContent className="h-48" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with action button */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Organizations
          </h1>
          <p className="text-neutral-400 font-light">
            Manage all platform organizations
          </p>
        </div>
        <Button
          onClick={() => setShowAddOrg(true)}
          className="bg-white text-black hover:bg-neutral-200 font-bold border border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {tenants.length === 0 ? (
        <div className="border border-neutral-900 rounded-lg p-12 text-center bg-neutral-950/50">
          <Building2 className="mx-auto h-16 w-16 text-neutral-700 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Organizations</h3>
          <p className="text-neutral-400 mb-6 max-w-md mx-auto">
            Get started by creating your first organization to manage teams and tickets
          </p>
          <Button
            onClick={() => setShowAddOrg(true)}
            className="bg-white text-black hover:bg-neutral-200 font-bold border border-neutral-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Organization
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="group relative p-5 rounded-lg border border-neutral-900 bg-neutral-950/50 hover:bg-neutral-900/50 hover:border-neutral-800 cursor-pointer transition-all duration-150"
            >
              {/* Terminal dot indicator */}
              <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-green-500/20 group-hover:bg-green-500/40 transition-colors"></div>
              
              <div className="pt-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-bold text-white truncate">
                        {tenant.name}
                      </h3>
                      {tenant.group && (
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {tenant.group.name}
                        </Badge>
                      )}
                    </div>
                    <div className="mb-2">
                      <code className="text-xs font-mono text-neutral-500 bg-black/50 px-2 py-1 rounded">
                        {tenant.slug}
                      </code>
                    </div>
                    {tenant.domain && (
                      <p className="text-xs text-neutral-500 font-light truncate">
                        {tenant.domain}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 pt-2 border-t border-neutral-900">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-neutral-600" />
                    <span className="text-sm font-mono font-bold text-white">
                      {tenant._count.users}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-neutral-600" />
                    <span className="text-sm font-mono font-bold text-white">
                      {tenant._count.tickets}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-neutral-900">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-white text-black hover:bg-neutral-200 border border-neutral-800 font-bold font-mono text-xs shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/organizations/${tenant.id}`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-red-950 text-red-400 hover:bg-red-900 border border-red-900 font-bold font-mono text-xs shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTenant(tenant.id, tenant.name);
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Organization Dialog */}
      <Dialog open={showAddOrg} onOpenChange={setShowAddOrg}>
        <DialogContent className="bg-neutral-950 border-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Organization</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Create a new organization to manage teams and tickets
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateOrg}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="org-name" className="text-neutral-300">Organization Name *</Label>
                <Input
                  id="org-name"
                  placeholder="Company name"
                  value={orgFormData.name}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  required
                  disabled={isCreatingOrg}
                  className="bg-black border-neutral-800 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="org-slug" className="text-neutral-300">Slug (identifier) *</Label>
                <Input
                  id="org-slug"
                  placeholder="company-slug"
                  value={orgFormData.slug}
                  onChange={(e) =>
                    setOrgFormData({ ...orgFormData, slug: e.target.value })
                  }
                  required
                  disabled={isCreatingOrg}
                  className="bg-black border-neutral-800 text-white font-mono"
                />
                <p className="text-xs text-neutral-600 font-mono">
                  Used in URL. Lowercase letters, numbers and hyphens only
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="org-domain" className="text-neutral-300">Domain (optional)</Label>
                <Input
                  id="org-domain"
                  placeholder="company.com"
                  value={orgFormData.domain}
                  onChange={(e) =>
                    setOrgFormData({ ...orgFormData, domain: e.target.value })
                  }
                  disabled={isCreatingOrg}
                  className="bg-black border-neutral-800 text-white font-mono"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddOrg(false)}
                disabled={isCreatingOrg}
                className="border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isCreatingOrg}
                className="bg-white text-black hover:bg-neutral-200 font-bold"
              >
                {isCreatingOrg ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
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

