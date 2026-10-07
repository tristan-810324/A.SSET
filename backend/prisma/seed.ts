import { prisma } from '../src/config/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';

const DEFAULT_PASSWORD = 'Admin123';

const defaultAccounts = [
  {
    email: 'custodian@gmail.com',
    role: 'CUSTODIAN' as const,
    fullName: 'Default Custodian',
  },
  {
    email: 'admin@gmail.com',
    role: 'ADMIN' as const,
    fullName: 'System Administrator',
  },
];

const main = async (): Promise<void> => {
  const passwordHash = await hashPassword(DEFAULT_PASSWORD);

  for (const account of defaultAccounts) {
    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        passwordHash,
        role: account.role,
        status: 'ACTIVE',
        isVerified: true,
        fullName: account.fullName,
      },
      create: {
        email: account.email,
        passwordHash,
        role: account.role,
        status: 'ACTIVE',
        isVerified: true,
        fullName: account.fullName,
      },
    });
  }

  console.log('Default admin and custodian accounts are ready.');
};

main()
  .catch((error) => {
    console.error('Unable to seed default accounts.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
