import { auth } from '../src/app/lib/auth';
import { prisma } from '../src/app/lib/prisma';
import { Role } from '../src/generated/prisma/enums';

async function seed() {
  console.log('--- Starting Seed Script ---');

  // 1. Create or ensure Demo User
  try {
    const userRes = await auth.api.signUpEmail({
      body: {
        name: 'Demo User',
        email: 'asadulimran1998@gmail.com',
        password: 'asad.emran',
      },
    });
    console.log('Signed up Demo User:', userRes?.user?.email);
  } catch (err: any) {
    console.log('Demo User signup note:', err?.message || err);
  }

  // 2. Create or ensure Demo Admin
  try {
    const adminRes = await auth.api.signUpEmail({
      body: {
        name: 'Demo Admin',
        email: 'asadulimran1999@gmail.com',
        password: 'asad.emran',
      },
    });
    console.log('Signed up Demo Admin:', adminRes?.user?.email);
  } catch (err: any) {
    console.log('Demo Admin signup note:', err?.message || err);
  }

  // Update both to emailVerified: true and verify roles
  const user = await prisma.user.update({
    where: { email: 'asadulimran1998@gmail.com' },
    data: { emailVerified: true, role: Role.USER },
  });
  console.log('User status:', user.email, 'emailVerified:', user.emailVerified, 'role:', user.role);

  const admin = await prisma.user.update({
    where: { email: 'asadulimran1999@gmail.com' },
    data: { emailVerified: true, role: Role.ADMIN },
  });
  console.log('Admin status:', admin.email, 'emailVerified:', admin.emailVerified, 'role:', admin.role);

  // 3. Create Demo Events
  const events = [
    {
      title: 'Tech Innovators Summit 2026',
      description: 'Join leading tech visionaries and creators for an immersive conference exploring AI, robotics, and the future of web architecture.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
      eventDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      venue: 'Bangabandhu International Conference Centre (BICC), Dhaka',
      eventLink: 'https://bicc-bd.com',
      visibility: 'PUBLIC' as const,
      feeType: 'FREE' as const,
      registrationFee: 0,
      ownerId: admin.id,
    },
    {
      title: 'Design & Code Hackathon',
      description: 'A 24-hour hands-on hackathon where developers and UI/UX designers collaborate to build accessible solutions for modern communities.',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop',
      eventDateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      venue: 'Gulshan Club Banquet Hall, Dhaka',
      eventLink: 'https://hackathon.example.com',
      visibility: 'PUBLIC' as const,
      feeType: 'PAID' as const,
      registrationFee: 500,
      ownerId: admin.id,
    },
    {
      title: 'Startup Pitch Night & Networking',
      description: 'Pitch your breakthrough startup idea to angel investors, network with fellow founders, and enjoy evening refreshments.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
      eventDateTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      venue: 'Pan Pacific Sonargaon, Dhaka',
      eventLink: 'https://startups.example.com',
      visibility: 'PUBLIC' as const,
      feeType: 'FREE' as const,
      registrationFee: 0,
      ownerId: user.id,
    },
    {
      title: 'Global Cloud & DevOps Workshop',
      description: 'Master CI/CD pipelines, Kubernetes clustering, and serverless observability with industry experts.',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop',
      eventDateTime: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      venue: 'Online Webinar (Zoom)',
      eventLink: 'https://zoom.us/j/demo-webinar',
      visibility: 'PUBLIC' as const,
      feeType: 'PAID' as const,
      registrationFee: 250,
      ownerId: user.id,
    },
  ];

  for (const ev of events) {
    const existing = await prisma.event.findFirst({ where: { title: ev.title } });
    if (!existing) {
      const created = await prisma.event.create({ data: ev });
      console.log('Created Event:', created.title);
    } else {
      console.log('Event already exists:', existing.title);
    }
  }

  console.log('All demo users and events seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Fatal Seed Error:', err);
  process.exit(1);
});
