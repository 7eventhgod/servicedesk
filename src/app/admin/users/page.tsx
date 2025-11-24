"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  KeyRound, 
  UserX, 
  UserCheck,
  Shield,
  Building2
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  tenantId: string | null;
  tenant: {
    name: string;
    slug: string;
  } | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [resetPasswordDialog, setResetPasswordDialog] = useState<{
    open: boolean;
    userId: string;
    userEmail: string;
  }>({ open: false, userId: "", userEmail: "" });
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    if (!session || session.user.role !== "ADMIN") return;

    async function fetchUsers() {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error loading users");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, [session]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.tenant?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsResetting(true);
    try {
      const response = await fetch(`/api/users/${resetPasswordDialog.userId}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reset password");
      }

      toast.success("Password reset successfully!", {
        description: `New password for ${resetPasswordDialog.userEmail}: ${newPassword}`
      });
      
      setResetPasswordDialog({ open: false, userId: "", userEmail: "" });
      setNewPassword("");
    } catch (error: any) {
      toast.error("Error resetting password", { description: error.message });
    } finally {
      setIsResetting(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update user status");

      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, isActive: !currentStatus } : u
        )
      );

      toast.success(`User ${!currentStatus ? "activated" : "deactivated"}`);
    } catch (error: any) {
      toast.error("Error updating status", { description: error.message });
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
      ADMIN: { label: "Super Admin", variant: "destructive" },
      TENANT_ADMIN: { label: "Admin", variant: "default" },
      AGENT: { label: "Agent", variant: "secondary" },
      USER: { label: "User", variant: "outline" },
    };
    
    const config = roleConfig[role] || roleConfig.USER;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="h-24" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-100 flex items-center gap-3">
          <Users className="h-8 w-8 text-green-500" />
          Organization Administrators
        </h1>
        <p className="text-neutral-400 mt-2">
          Manage tenant administrators (TENANT_ADMIN)
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400">
              Total Administrators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {users.filter(u => u.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400">
              Organizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {new Set(users.map(u => u.tenantId).filter(Boolean)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Search by email, name or organization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map(user => (
          <Card key={user.id} className={`${!user.isActive ? "opacity-60" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-full ${
                    user.role === "ADMIN" ? "bg-red-900/50" :
                    user.role === "TENANT_ADMIN" ? "bg-blue-900/50" :
                    user.role === "AGENT" ? "bg-green-900/50" : "bg-neutral-800"
                  }`}>
                    <Shield className={`h-5 w-5 ${
                      user.role === "ADMIN" ? "text-red-400" :
                      user.role === "TENANT_ADMIN" ? "text-blue-400" :
                      user.role === "AGENT" ? "text-green-400" : "text-neutral-400"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-neutral-100">{user.name || "No name"}</h3>
                      {getRoleBadge(user.role)}
                      {!user.isActive && <Badge variant="destructive">Inactive</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-400">
                      <span>{user.email}</span>
                      {user.tenant && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span>{user.tenant.name}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setResetPasswordDialog({
                        open: true,
                        userId: user.id,
                        userEmail: user.email
                      })
                    }
                  >
                    <KeyRound className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                  <Button
                    size="sm"
                    variant={user.isActive ? "outline" : "default"}
                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                  >
                    {user.isActive ? (
                      <>
                        <UserX className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-neutral-400">
                {searchQuery ? "Try changing your search query" : "No users in the system"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialog.open} onOpenChange={(open) => {
        setResetPasswordDialog({ ...resetPasswordDialog, open });
        if (!open) setNewPassword("");
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter a new password for user <strong>{resetPasswordDialog.userEmail}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={generatePassword}
              className="w-full"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Generate Password
            </Button>
            {newPassword && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  ⚠️ Save this password!
                </p>
                <code className="text-sm bg-white px-2 py-1 rounded border">
                  {newPassword}
                </code>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setResetPasswordDialog({ open: false, userId: "", userEmail: "" });
                setNewPassword("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={isResetting || !newPassword}
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

