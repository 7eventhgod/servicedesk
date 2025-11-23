import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * POST /api/reset-demo - Reset demo tenant data
 * This endpoint resets all demo tenant data to initial state
 */
export async function POST() {
  try {
    console.log('🔄 Starting demo data reset via API...');

    // Find the demo tenant
    const demoTenant = await prisma.tenant.findUnique({
      where: { slug: 'demo' },
    });

    if (!demoTenant || !demoTenant.isDemo) {
      console.log('⚠️ Demo tenant not found or not marked as demo. Skipping reset.');
      return NextResponse.json({ 
        success: false, 
        message: 'Demo tenant not found or not marked as demo' 
      }, { status: 404 });
    }

    console.log(`📍 Found demo tenant: ${demoTenant.name}`);

    // Delete all data created by users in demo tenant
    console.log('🗑️ Deleting user-created data...');

    // Delete in correct order to respect foreign key constraints
    await prisma.comment.deleteMany({
      where: {
        ticket: { tenantId: demoTenant.id },
      },
    });

    await prisma.ticket.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    await prisma.category.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    await prisma.queue.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    await prisma.slaPolicy.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    await prisma.customField.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    await prisma.knowledgeArticle.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    await prisma.automationRule.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    await prisma.asset.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    await prisma.webhook.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    await prisma.userInvitation.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    await prisma.auditLog.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    await prisma.telegramBot.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    await prisma.ldapConfig.deleteMany({
      where: { tenantId: demoTenant.id },
    });

    console.log('✅ User-created data deleted');

    // Re-seed the demo data
    console.log('🌱 Re-seeding demo data...');
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const agentPassword = await bcrypt.hash('agent123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Update existing users' passwords (if they exist)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@demo.com' },
      update: {},
      create: {
        email: 'admin@demo.com',
        name: 'Organization Administrator',
        password: adminPassword,
        role: 'TENANT_ADMIN',
        tenantId: demoTenant.id,
      },
    });

    const agent = await prisma.user.upsert({
      where: { email: 'agent@demo.com' },
      update: {},
      create: {
        email: 'agent@demo.com',
        name: 'Support Agent',
        password: agentPassword,
        role: 'AGENT',
        tenantId: demoTenant.id,
      },
    });

    const user = await prisma.user.upsert({
      where: { email: 'user@demo.com' },
      update: {},
      create: {
        email: 'user@demo.com',
        name: 'Regular User',
        password: userPassword,
        role: 'USER',
        tenantId: demoTenant.id,
      },
    });

    // Create categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Technical Support',
          color: '#3b82f6',
          tenantId: demoTenant.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Network and Connectivity',
          color: '#10b981',
          tenantId: demoTenant.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Software',
          color: '#f59e0b',
          tenantId: demoTenant.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Hardware',
          color: '#ef4444',
          tenantId: demoTenant.id,
        },
      }),
    ]);

    console.log('✅ Created categories:', categories.length);

    // Create tickets
    const tickets = await Promise.all([
      prisma.ticket.create({
        data: {
          title: 'Printer not working on third floor',
          description:
            'Good day! The HP LaserJet printer on the third floor of our office stopped working. When trying to print, it shows an error.',
          status: 'OPEN',
          priority: 'HIGH',
          tenantId: demoTenant.id,
          categoryId: categories[3].id,
          creatorId: user.id,
        },
      }),
      prisma.ticket.create({
        data: {
          title: 'Request to install Adobe Photoshop',
          description:
            'Hello! I need Adobe Photoshop installed for working on design projects. When can we schedule the installation?',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          tenantId: demoTenant.id,
          categoryId: categories[2].id,
          creatorId: user.id,
          assigneeId: agent.id,
        },
      }),
      prisma.ticket.create({
        data: {
          title: 'Wi-Fi connection issue',
          description:
            'After updating the system, I cannot connect to the corporate Wi-Fi network. I&apos;m entering the correct password, but it shows an authentication error.',
          status: 'RESOLVED',
          priority: 'URGENT',
          tenantId: demoTenant.id,
          categoryId: categories[1].id,
          creatorId: user.id,
          assigneeId: agent.id,
          resolvedAt: new Date(),
        },
      }),
      prisma.ticket.create({
        data: {
          title: 'Slow computer performance',
          description:
            'For the past week, my computer has been running very slowly. Programs take a long time to open, and the system often freezes.',
          status: 'OPEN',
          priority: 'LOW',
          tenantId: demoTenant.id,
          categoryId: categories[0].id,
          creatorId: user.id,
        },
      }),
    ]);

    console.log('✅ Created tickets:', tickets.length);

    // Create comments
    await prisma.comment.createMany({
      data: [
        {
          content:
            'Thank you for contacting us! We will check the printer shortly.',
          ticketId: tickets[0].id,
          authorId: agent.id,
          isInternal: false,
        },
        {
          content: 'Starting work on software installation.',
          ticketId: tickets[1].id,
          authorId: agent.id,
          isInternal: false,
        },
        {
          content: 'Installation completed. Please check.',
          ticketId: tickets[1].id,
          authorId: agent.id,
          isInternal: false,
        },
        {
          content:
            'Issue resolved. Encryption type was changed on the router. Please try reconnecting.',
          ticketId: tickets[2].id,
          authorId: agent.id,
          isInternal: false,
        },
        {
          content: 'Thank you! Everything works great!',
          ticketId: tickets[2].id,
          authorId: user.id,
          isInternal: false,
        },
      ],
    });

    console.log('✅ Created comments');
    console.log('🎉 Demo tenant successfully reset to initial state!');

    return NextResponse.json({ 
      success: true, 
      message: 'Demo tenant successfully reset to initial state',
      data: {
        categories: categories.length,
        tickets: tickets.length,
      },
    });
  } catch (error) {
    console.error('❌ Error resetting demo:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to reset demo tenant',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

