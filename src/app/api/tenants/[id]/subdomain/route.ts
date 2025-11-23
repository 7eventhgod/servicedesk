import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomBytes } from "crypto";

const subdomainSchema = z.object({
  subdomain: z.string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(253, "Subdomain is too long")
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/, 
      "Invalid subdomain format. Example: help.sig.az"),
});

/**
 * GET /api/tenants/[id]/subdomain - Get subdomain settings
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
        subdomain: true,
        subdomainVerified: true,
        subdomainVerificationToken: true,
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
      subdomain: tenant.subdomain,
      verified: tenant.subdomainVerified,
      verificationToken: tenant.subdomainVerificationToken,
    });
  } catch (error: any) {
    console.error("[Subdomain GET Error]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tenants/[id]/subdomain - Set subdomain
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

    // Check access - only TENANT_ADMIN or ADMIN can set
    if (session.user.role !== "ADMIN" && 
        (session.user.role !== "TENANT_ADMIN" || session.user.tenantId !== tenant.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { subdomain } = subdomainSchema.parse(body);

    // Check if subdomain is already taken
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        subdomain: subdomain,
        id: { not: params.id },
      },
      select: { id: true },
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: "This subdomain is already in use by another organization" },
        { status: 409 }
      );
    }

    // Generate token for DNS verification
    const verificationToken = `onpoints-verify=${randomBytes(16).toString("hex")}`;

    // Update tenant with subdomain (unverified initially)
    const updatedTenant = await prisma.tenant.update({
      where: { id: params.id },
      data: {
        subdomain: subdomain,
        subdomainVerified: false,
        subdomainVerificationToken: verificationToken,
      },
      select: {
        id: true,
        subdomain: true,
        subdomainVerified: true,
        subdomainVerificationToken: true,
      },
    });

    console.log(`[Subdomain] Set subdomain ${subdomain} for tenant ${params.id} (unverified)`);

    return NextResponse.json({ 
      subdomain: updatedTenant.subdomain,
      verified: updatedTenant.subdomainVerified,
      verificationToken: updatedTenant.subdomainVerificationToken,
    });
  } catch (error: any) {
    console.error("[Subdomain POST Error]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tenants/[id]/subdomain - Remove subdomain
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

    // Check access - only TENANT_ADMIN or ADMIN can remove
    if (session.user.role !== "ADMIN" && 
        (session.user.role !== "TENANT_ADMIN" || session.user.tenantId !== tenant.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Remove subdomain
    await prisma.tenant.update({
      where: { id: params.id },
      data: {
        subdomain: null,
        subdomainVerified: false,
        subdomainVerificationToken: null,
      },
    });

    console.log(`[Subdomain] Removed subdomain for tenant ${params.id}`);

    return NextResponse.json({ message: "Subdomain removed successfully" });
  } catch (error: any) {
    console.error("[Subdomain DELETE Error]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

