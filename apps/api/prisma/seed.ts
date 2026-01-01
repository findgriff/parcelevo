/* eslint-disable no-console */
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const opsEmail = process.env.SEED_OPS_EMAIL || 'ops@parcelevo.com';

  const user = await prisma.user.upsert({
    where: { email: opsEmail },
    update: {},
    create: {
      email: opsEmail,
      role: UserRole.ops,
      status: 'active',
    },
  });

  console.log('Seeded ops user:', user.email, user.id);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
