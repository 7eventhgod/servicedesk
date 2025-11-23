import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/agents - Get all organization agents
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins, tenant admins and agents can view agents
    if (session.user.role !== "ADMIN" && session.user.role !== "TENANT_ADMIN" && session.user.role !== "AGENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const agents = await prisma.user.findMany({
      where: {
        tenantId: session.user.tenantId,
        role: "AGENT",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        agentStatus: true,
        permissions: true,
        createdAt: true,
        _count: {
          select: {
            assignedTickets: {
              where: {
                status: {
                  in: ["OPEN", "IN_PROGRESS", "PENDING"],
                },
              },
            },
            categoryAssignments: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
