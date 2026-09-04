import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { envVars } from '../config/env.config';
import { PrismaClient } from '../../generated/prisma/client';

const pool = new Pool({
  connectionString: envVars.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ensureEventStatusSchema = async () => {
  try {
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EventStatus') THEN
          CREATE TYPE "EventStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
        END IF;
      END
      $$;
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Event"
      ADD COLUMN IF NOT EXISTS "status" "EventStatus" NOT NULL DEFAULT 'ACTIVE';
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Event_status_idx" ON "Event" ("status");
    `);
  } catch (error) {
    console.warn('Schema compatibility check skipped or failed:', error);
  }
};

const prismaSchemaReady = ensureEventStatusSchema();

export { prisma, prismaSchemaReady };