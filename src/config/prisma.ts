import { PrismaClient, Role, StudentState } from '@prisma/client';

const prisma = new PrismaClient();
console.log('Prisma has initted');

export { prisma, Role, StudentState };
