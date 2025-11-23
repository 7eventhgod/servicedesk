import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

/**
 * GET /api/tenants/[id]/sync/api-key - Get AD sync API key
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        adSyncEnabled: true,
        adSyncApiKey: true,
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Check access - only TENANT_ADMIN or ADMIN can view
    if (session.user.role !== "ADMIN" && 
        (session.user.role !== "TENANT_ADMIN" || session.user.tenantId !== tenant.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ 
      adSyncEnabled: tenant.adSyncEnabled,
      hasApiKey: !!tenant.adSyncApiKey,
      // Don't return the actual API key for security - only show if it exists
    });
  } catch (error: any) {
    console.error("[AD Sync API Key GET Error]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tenants/[id]/sync/api-key - Generate new AD sync API key
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Check access - only TENANT_ADMIN or ADMIN can generate
    if (session.user.role !== "ADMIN" && 
        (session.user.role !== "TENANT_ADMIN" || session.user.tenantId !== tenant.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Generate new API key
    const apiKey = `ad-sync-${randomBytes(32).toString("hex")}`;

    // Update tenant with new API key
    const updatedTenant = await prisma.tenant.update({
      where: { id: params.id },
      data: {
        adSyncApiKey: apiKey,
        adSyncEnabled: true,
      },
      select: {
        id: true,
        adSyncApiKey: true,
        adSyncEnabled: true,
      },
    });

    console.log(`[AD Sync] Generated new API key for tenant ${params.id}`);

    return NextResponse.json({ 
      apiKey: updatedTenant.adSyncApiKey,
      adSyncEnabled: updatedTenant.adSyncEnabled,
      message: "API key generated successfully. Save this key securely - it will only be shown once.",
    });
  } catch (error: any) {
    console.error("[AD Sync API Key POST Error]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tenants/[id]/sync/api-key - Revoke AD sync API key
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Check access - only TENANT_ADMIN or ADMIN can revoke
    if (session.user.role !== "ADMIN" && 
        (session.user.role !== "TENANT_ADMIN" || session.user.tenantId !== tenant.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Revoke API key and disable sync
    await prisma.tenant.update({
      where: { id: params.id },
      data: {
        adSyncApiKey: null,
        adSyncEnabled: false,
      },
    });

    console.log(`[AD Sync] Revoked API key for tenant ${params.id}`);

    return NextResponse.json({ 
      message: "API key revoked successfully",
      adSyncEnabled: false,
    });
  } catch (error: any) {
    console.error("[AD Sync API Key DELETE Error]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

