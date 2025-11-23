import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const syncUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  active: z.boolean().default(true),
  groups: z.array(z.string()).optional(),
  attributes: z.record(z.any()).optional(),
});

const syncUsersSchema = z.object({
  users: z.array(syncUserSchema),
});

/**
 * POST /api/tenants/[id]/sync/users - Sync users from AD
 * Authenticated via API key in header: X-AD-Sync-Api-Key
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get API key from header
    const apiKey = request.headers.get("x-ad-sync-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API key. Provide X-AD-Sync-Api-Key header." },
        { status: 401 }
      );
    }

    // Find tenant by API key
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: params.id,
        adSyncApiKey: apiKey,
        adSyncEnabled: true,
      },
      select: {
        id: true,
        adSyncEnabled: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Invalid API key or AD sync is disabled" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { users } = syncUsersSchema.parse(body);

    const results = {
      created: 0,
      updated: 0,
      errors: [] as Array<{ email: string; error: string }>,
    };

    // Process each user
    for (const userData of users) {
      try {
        // Find existing user by email and tenant
        const existingUser = await prisma.user.findFirst({
          where: {
            email: userData.email,
            tenantId: tenant.id,
          },
          select: {
            id: true,
            password: true,
          },
        });

        const userDataToSave = {
          email: userData.email,
          name: userData.name,
          isActive: userData.active,
          tenantId: tenant.id,
          role: "USER" as const, // Default role, can be changed by admin
          password: existingUser?.password || "", // Keep existing password or empty (LDAP users have no password)
        };

        if (existingUser) {
          // Update existing user
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: userDataToSave.name,
              isActive: userDataToSave.isActive,
              // Don't update email, tenantId, or password
            },
          });
          results.updated++;
        } else {
          // Create new user
          await prisma.user.create({
            data: userDataToSave,
          });
          results.created++;
        }

        // TODO: Handle groups and attributes if needed
        // Could store in a separate table or in user.permissions field
      } catch (error: any) {
        console.error(`[AD Sync] Error processing user ${userData.email}:`, error);
        results.errors.push({
          email: userData.email,
          error: error.message || "Unknown error",
        });
      }
    }

    console.log(`[AD Sync] Synced users for tenant ${params.id}: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors`);

    return NextResponse.json({
      success: true,
      results,
      message: `Synced ${users.length} users: ${results.created} created, ${results.updated} updated`,
    });
  } catch (error: any) {
    console.error("[AD Sync Users POST Error]", error);

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
 * GET /api/tenants/[id]/sync/users - Get sync status (for testing)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get API key from header
    const apiKey = request.headers.get("x-ad-sync-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API key" },
        { status: 401 }
      );
    }

    // Verify API key
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: params.id,
        adSyncApiKey: apiKey,
        adSyncEnabled: true,
      },
      select: {
        id: true,
        name: true,
        adSyncEnabled: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Invalid API key or AD sync is disabled" },
        { status: 401 }
      );
    }

    // Get user count
    const userCount = await prisma.user.count({
      where: {
        tenantId: tenant.id,
      },
    });

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        adSyncEnabled: tenant.adSyncEnabled,
      },
      userCount,
      message: "API key is valid",
    });
  } catch (error: any) {
    console.error("[AD Sync Users GET Error]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

