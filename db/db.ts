import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/* pool do Postgres */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

/* adapter Prisma */
const adapter = new PrismaPg(pool)

/* singleton Prisma Client */
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}

export default db
