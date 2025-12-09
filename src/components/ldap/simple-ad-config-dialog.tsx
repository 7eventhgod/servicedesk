"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle2, Info, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SimpleADConfigDialogProps {
  children: React.ReactNode;
  onConfigCreated?: () => void;
}

export function SimpleADConfigDialog({ 
  children, 
  onConfigCreated 
}: SimpleADConfigDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [importUsersAfterSave, setImportUsersAfterSave] = useState(true);
  const [createdConfigId, setCreatedConfigId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Simple fields
  const [name, setName] = useState("");
  const [serverAddress, setServerAddress] = useState("");
  const [domain, setDomain] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  // Advanced settings (optional)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customPort, setCustomPort] = useState("");
  const [useSSL, setUseSSL] = useState(false);

  // Automatically change port when SSL is toggled
  const effectivePort = customPort || (useSSL ? "636" : "389");

  const handleTestConnection = async () => {
    if (!serverAddress || !domain || !adminUsername || !adminPassword) {
      toast.error("Fill in all required fields");
      return;
    }

    setIsTesting(true);
    setTestSuccess(false);

    try {
      const response = await fetch(`/api/ldap/test-connection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverAddress,
          domain,
          adminUsername,
          adminPassword,
          port: parseInt(effectivePort),
          useSSL,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTestSuccess(true);
        toast.success("Connection successful!", {
          description: `Found ${result.usersCount || 0} users`,
        });
      } else {
        const errorMsg = result.error || "Check settings";
        
        toast.error("Connection error", {
          description: errorMsg,
          duration: 8000, // Show longer for timeouts
        });
      }
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to connect to server",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !serverAddress || !domain || !adminUsername || !adminPassword) {
      toast.error("Fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Automatically generate correct LDAP settings
      const port = parseInt(effectivePort);
      const baseDn = `DC=${domain.split('.').join(',DC=')}`;
      const bindDn = `${adminUsername}@${domain}`;
      const userSearchBase = baseDn;
      // Correct filter: only users (not computers), only active
      const userSearchFilter = "(&(objectClass=user)(objectCategory=person)(!(objectClass=computer))(!(userAccountControl:1.2.840.113556.1.4.803:=2)))";

      const response = await fetch(`/api/ldap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type: "ACTIVE_DIRECTORY",
          host: serverAddress,
          port,
          baseDn,
          bindDn,
          bindPassword: adminPassword,
          userSearchBase,
          userSearchFilter,
          isActive,
          useSSL, // Pass SSL flag
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create connection");
      }

      const result = await response.json();
      const configId = result.id;

      toast.success("Active Directory connected!", {
        description: "Connection saved successfully",
      });

      // If user wants to import users immediately
      if (importUsersAfterSave && configId) {
        setCreatedConfigId(configId);
        setIsSyncing(true);
        
        try {
          const syncResponse = await fetch(`/api/ldap/${configId}/sync`, {
            method: "POST",
          });

          if (syncResponse.ok) {
            const syncResult = await syncResponse.json();
            toast.success("Users imported successfully!", {
              description: `✓ Found: ${syncResult.usersFound} | Created: ${syncResult.usersCreated} | Updated: ${syncResult.usersUpdated}`,
              duration: 6000,
            });
          } else {
            const error = await syncResponse.json();
            toast.error("Import failed", {
              description: error.error || "Failed to import users. You can try again from the connection list.",
            });
          }
        } catch (error: any) {
          toast.error("Import error", {
            description: error.message,
          });
        } finally {
          setIsSyncing(false);
        }
      }

      // Reset form
      setName("");
      setServerAddress("");
      setDomain("");
      setAdminUsername("");
      setAdminPassword("");
      setIsActive(false);
      setTestSuccess(false);
      setImportUsersAfterSave(true);
      setCreatedConfigId(null);
      setIsOpen(false);

      onConfigCreated?.();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Connect Active Directory
          </DialogTitle>
          <DialogDescription>
            Connect your corporate domain for single sign-on for employees
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Network requirement warning */}
          <Alert variant="default" className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              <strong>Network Requirement:</strong> This direct connection only works if ServiceDesk can reach your AD server.
              If you're using <strong>cloud-hosted ServiceDesk</strong> with <strong>on-premise AD</strong>,
              please use the <a href="/dashboard/settings/ad-sync" className="underline font-medium">On-Premise Agent</a> instead.
            </AlertDescription>
          </Alert>

          {/* Info block */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Quick tip:</strong> Open command prompt on any computer in the domain and run{" "}
              <code className="bg-muted px-1 rounded">echo %LOGONSERVER%</code> to find the server address and{" "}
              <code className="bg-muted px-1 rounded">echo %USERDNSDOMAIN%</code> to find the domain.
            </AlertDescription>
          </Alert>

          {/* Basic settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Connection Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Corporate Active Directory"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Example: "Corporate AD" or "Office Domain"
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serverAddress">
                  Server Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="serverAddress"
                  value={serverAddress}
                  onChange={(e) => setServerAddress(e.target.value)}
                  placeholder="dc.company.local or 192.168.1.10"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  IP address or name of your domain controller
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">
                  Domain <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="company.local"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your domain name (e.g.: company.local, office.com)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminUsername">
                    Admin Username <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="adminUsername"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="administrator"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPassword">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Activate Connection
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Allow sign in via domain
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="importUsers" className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    Import Users After Saving
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically import all users from AD right after connection is created
                  </p>
                </div>
                <Switch
                  id="importUsers"
                  checked={importUsersAfterSave}
                  onCheckedChange={setImportUsersAfterSave}
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced settings (hidden by default) */}
          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm"
            >
              {showAdvanced ? "Hide" : "Show"} advanced settings
            </Button>

            {showAdvanced && (
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle className="text-base">Advanced Settings</CardTitle>
                  <CardDescription>
                    Usually not required to change
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="useSSL">Secure Connection (SSL/TLS)</Label>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <span className="text-sm font-medium">
                            Use LDAPS
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {useSSL ? "Port 636 (secured)" : "Port 389 (unsecured)"}
                          </p>
                        </div>
                        <Switch
                          id="useSSL"
                          checked={useSSL}
                          onCheckedChange={setUseSSL}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customPort">Port (optional)</Label>
                      <Input
                        id="customPort"
                        value={customPort}
                        onChange={(e) => setCustomPort(e.target.value)}
                        placeholder={effectivePort}
                      />
                      <p className="text-xs text-muted-foreground">
                        Current port: {effectivePort}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting || isSubmitting}
              className="flex-1"
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : testSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  Connected
                </>
              ) : (
                "Test Connection"
              )}
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || isTesting || isSyncing}
              className="flex-1"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing Users...
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : importUsersAfterSave ? (
                "Save & Import Users"
              ) : (
                "Save"
              )}
            </Button>
          </div>

          {importUsersAfterSave && (
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-xs">
                <strong>Auto Import:</strong> After connection is saved, all users from your Active Directory will be automatically imported.
                They can then immediately sign in using their Windows username and password.
              </AlertDescription>
            </Alert>
          )}
          
          <p className="text-xs text-muted-foreground text-center">
            Users can sign in using: <strong>domain\username</strong> or <strong>username@domain</strong>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

