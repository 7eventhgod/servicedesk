"use client";

import { LdapConfigList } from "@/components/ldap/ldap-config-list";
import { SimpleADConfigDialog } from "@/components/ldap/simple-ad-config-dialog";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, Shield, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleGuard } from "@/components/module-guard";
import { useSession } from "next-auth/react";

export default function LdapPage() {
  const { data: session } = useSession();
  const isGlobalAdmin = session?.user.role === "ADMIN" && !session?.user.tenantId;

  return (
    <ModuleGuard module="ldap" moduleName="LDAP / SSO">
      <div className="container relative space-y-6">
        <PageHeader>
          <PageHeaderHeading className="flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Active Directory / LDAP
          </PageHeaderHeading>
          <PageHeaderDescription>
            Connect your corporate domain for single sign-on for employees
          </PageHeaderDescription>
        </PageHeader>

        {/* Warning for global admin */}
        {isGlobalAdmin && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> You are signed in as a global administrator. 
              To configure LDAP/Active Directory, you need to sign in as an organization administrator (TENANT_ADMIN).
              LDAP configuration is tied to the organization, not to the global admin.
            </AlertDescription>
          </Alert>
        )}

        {/* Network Setup Guide */}
        {!isGlobalAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-2 border-blue-200 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  Direct Connection (This Page)
                </CardTitle>
                <CardDescription>
                  Works when Service-Desk is on the same network as your AD
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Use this method if:</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>✓ Self-hosted ServiceDesk on your network</li>
                  <li>✓ VPN connection between ServiceDesk and AD</li>
                  <li>✓ Both on same LAN/datacenter</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  <strong>Setup time:</strong> 2 minutes
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-900">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  On-Premise Agent (Recommended for Cloud)
                </CardTitle>
                <CardDescription>
                  For cloud-hosted ServiceDesk connecting to on-premise AD
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Use this method if:</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>✓ ServiceDesk hosted in cloud/external network</li>
                  <li>✓ AD is on-premise behind firewall</li>
                  <li>✓ No VPN between cloud and AD</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  <strong>Setup time:</strong> 5 minutes (install agent on AD network)
                </p>
                <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                  <a href="/dashboard/settings/ad-sync" target="_blank">
                    Setup On-Premise Agent →
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What does connecting provide?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Single Sign-On</p>
                  <p className="text-xs text-muted-foreground">
                    Employees sign in with their Windows credentials
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Automatic Registration</p>
                  <p className="text-xs text-muted-foreground">
                    New users are created on first sign in
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Security</p>
                  <p className="text-xs text-muted-foreground">
                    Passwords are not stored, only read from AD
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection button */}
        <div className="flex flex-col gap-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Important:</strong> Direct connection only works if ServiceDesk can reach your AD server over the network.
              If you're using cloud-hosted ServiceDesk with on-premise AD, use the <strong>On-Premise Agent</strong> method instead.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <SimpleADConfigDialog>
              <Button size="lg" disabled={isGlobalAdmin}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Direct Connection Setup
              </Button>
            </SimpleADConfigDialog>
          </div>
        </div>

        {/* Connections list */}
        <Suspense fallback={<Skeleton className="w-full h-[300px] rounded-lg" />}>
          <LdapConfigList />
        </Suspense>
      </div>
    </ModuleGuard>
  );
}

