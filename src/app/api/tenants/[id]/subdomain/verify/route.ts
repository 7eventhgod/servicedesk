import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/tenants/[id]/subdomain/verify - Verify DNS verification
 */
export async function PUT(
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
        subdomainVerificationToken: true,
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Check access - only TENANT_ADMIN or ADMIN can verify
    if (session.user.role !== "ADMIN" && 
        (session.user.role !== "TENANT_ADMIN" || session.user.tenantId !== tenant.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!tenant.subdomain || !tenant.subdomainVerificationToken) {
      return NextResponse.json(
        { error: "No subdomain configured" },
        { status: 400 }
      );
    }

    // Check DNS TXT record
    const dnsVerified = await verifyDnsRecord(
      tenant.subdomain,
      tenant.subdomainVerificationToken
    );

    if (!dnsVerified) {
      return NextResponse.json(
        { error: "DNS verification failed", verified: false },
        { status: 400 }
      );
    }

    // Update verification status
    await prisma.tenant.update({
      where: { id: params.id },
      data: {
        subdomainVerified: true,
      },
    });

    console.log(`[Subdomain] Verified subdomain ${tenant.subdomain} for tenant ${params.id}`);

    return NextResponse.json({ verified: true });
  } catch (error: any) {
    console.error("[Subdomain Verify Error]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Verify DNS TXT record for subdomain verification
 */
async function verifyDnsRecord(
  subdomain: string,
  expectedToken: string
): Promise<boolean> {
  try {
    const dns = require('dns').promises;
    
    // Extract root domain from subdomain (e.g., "help.sig.az" -> "sig.az")
    const domainParts = subdomain.split('.');
    if (domainParts.length < 2) {
      console.error('[DNS Verification] Invalid subdomain format:', subdomain);
      return false;
    }
    
    const rootDomain = domainParts.slice(-2).join('.');
    const verificationHost = `_onpoints-verify.${rootDomain}`;
    
    console.log(`[DNS Verification] Checking TXT record for ${verificationHost}`);
    console.log(`[DNS Verification] Expected token: ${expectedToken}`);
    
    try {
      const txtRecords = await dns.resolveTxt(verificationHost);
      
      console.log(`[DNS Verification] Found TXT records:`, txtRecords);
      
      // Check if any record contains the expected token
      const found = txtRecords.some((record: string[]) => {
        const recordValue = record.join('');
        return recordValue === expectedToken || recordValue.includes(expectedToken);
      });
      
      if (found) {
        console.log(`[DNS Verification] ✅ DNS verification successful for ${subdomain}`);
        return true;
      } else {
        console.log(`[DNS Verification] ❌ DNS verification failed - token mismatch`);
        return false;
      }
    } catch (dnsError: any) {
      // DNS lookup failed - record doesn't exist or DNS error
      console.error('[DNS Verification] DNS lookup failed:', dnsError.message);
      console.error('[DNS Verification] Make sure the TXT record exists: _onpoints-verify.' + rootDomain);
      return false;
    }
  } catch (error) {
    console.error("[DNS Verification Error]", error);
    return false;
  }
}

