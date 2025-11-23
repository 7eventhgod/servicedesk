"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, Info, Copy, Eye, EyeOff, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";
import { ModuleGuard } from "@/components/module-guard";

export default function ADSyncSettingsPage() {
  return (
    <ModuleGuard module="ldap" moduleName="AD Sync">
      <ADSyncSettingsPageContent />
    </ModuleGuard>
  );
}

function ADSyncSettingsPageContent() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [adSyncEnabled, setAdSyncEnabled] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    if (!session?.user?.tenantId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/tenants/${session.user.tenantId}/sync/api-key`);
      if (response.ok) {
        const data = await response.json();
        setHasApiKey(data.hasApiKey || false);
        setAdSyncEnabled(data.adSyncEnabled || false);
      }
    } catch (error) {
      toast.error("Error loading AD sync settings");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateApiKey = async () => {
    if (!session?.user?.tenantId) return;
    
    setGenerating(true);
    try {
      const response = await fetch(`/api/tenants/${session.user.tenantId}/sync/api-key`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setApiKey(data.apiKey);
        setHasApiKey(true);
        setAdSyncEnabled(true);
        setShowApiKey(true);
        toast.success("API key generated successfully. Save it securely!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Error generating API key");
      }
    } catch (error) {
      toast.error("Error generating API key");
    } finally {
      setGenerating(false);
    }
  };

  const handleRevokeApiKey = async () => {
    if (!session?.user?.tenantId) return;
    
    setRevoking(true);
    try {
      const response = await fetch(`/api/tenants/${session.user.tenantId}/sync/api-key`, {
        method: "DELETE",
      });

      if (response.ok) {
        setApiKey(null);
        setHasApiKey(false);
        setAdSyncEnabled(false);
        setShowApiKey(false);
        toast.success("API key revoked successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Error revoking API key");
      }
    } catch (error) {
      toast.error("Error revoking API key");
    } finally {
      setRevoking(false);
    }
  };

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast.success("API key copied to clipboard");
    }
  };

  if (session?.user.role !== "TENANT_ADMIN" && session?.user.role !== "ADMIN") {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Only organization administrators can manage AD sync settings.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Active Directory Sync</h1>
        <p className="text-muted-foreground mt-2">
          Configure AD sync agent to synchronize users from your local Active Directory
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Install the AD sync agent on a server with access to your Active Directory.
          The agent will periodically sync users to this platform.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
          <CardDescription>
            Generate an API key for the AD sync agent to authenticate with this platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasApiKey && !apiKey ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                No API key configured. Generate a new key to enable AD sync.
              </p>
              <Button
                onClick={handleGenerateApiKey}
                disabled={generating}
                className="w-full sm:w-auto"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate API Key
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey || "••••••••••••••••"}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  {apiKey && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyApiKey}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {apiKey 
                    ? "⚠️ Save this key securely! It will not be shown again after you leave this page."
                    : "API key exists but is hidden for security. Generate a new one to see it."}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleGenerateApiKey}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate Key
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRevokeApiKey}
                  disabled={revoking}
                >
                  {revoking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Revoking...
                    </>
                  ) : (
                    "Revoke Key"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync Configuration</CardTitle>
          <CardDescription>
            Configure AD sync settings and endpoint information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Sync Endpoint</Label>
            <Input
              value={session?.user?.tenantId 
                ? `${typeof window !== 'undefined' ? window.location.origin : ''}/api/tenants/${session.user.tenantId}/sync/users`
                : ''
              }
              readOnly
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Use this endpoint in your AD sync agent configuration
            </p>
          </div>

          <div className="space-y-2">
            <Label>Authentication Header</Label>
            <Input
              value="X-AD-Sync-Api-Key: &lt;your-api-key&gt;"
              readOnly
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Include this header with every sync request
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync Agent</CardTitle>
          <CardDescription>
            Download and configure the AD sync agent for your platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download the AD sync agent program to synchronize users from your local Active Directory.
            </p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Installation Steps:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Download and extract the ZIP archive</li>
                <li>Install Python 3.8+ and dependencies: <code className="bg-muted px-1 rounded">pip install -r requirements.txt</code></li>
                <li>Copy <code className="bg-muted px-1 rounded">.env.example</code> to <code className="bg-muted px-1 rounded">.env</code> and configure</li>
                <li>Run the agent: <code className="bg-muted px-1 rounded">python ad_sync_agent.py</code></li>
              </ol>
            </div>

            <Button
              onClick={async () => {
                try {
                  const response = await fetch("/api/ad-sync-agent/download");
                  if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || "Failed to download agent");
                  }
                  
                  // Download as file
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "ad-sync-agent.zip";
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  
                  toast.success("AD sync agent downloaded successfully!");
                } catch (error: any) {
                  toast.error(error.message || "Failed to download agent");
                }
              }}
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Download AD Sync Agent
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

