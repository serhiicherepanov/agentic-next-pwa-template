import { PrismaClient } from "@prisma/client";

type GlobalForPrisma = {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as unknown as GlobalForPrisma;

function createPrismaClient(): PrismaClient {
  const log: ("warn" | "error")[] =
    process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"];

  if (process.env.DATABASE_DRIVER === "neon") {
    return createNeonPrismaClient(log);
  }

  return new PrismaClient({ log });
}

function createNeonPrismaClient(log: ("warn" | "error")[]): PrismaClient {
  // Neon serverless driver enables Postgres over HTTP/WebSocket, required
  // for edge runtimes and recommended on Vercel serverless. Imports are
  // deferred so the dependency is only loaded when explicitly enabled.

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required when DATABASE_DRIVER=neon");
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaNeon } = require("@prisma/adapter-neon") as typeof import("@prisma/adapter-neon");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { neonConfig } = require("@neondatabase/serverless") as typeof import("@neondatabase/serverless");

  // The Neon serverless driver needs a WebSocket implementation in Node.js.
  // Edge runtimes provide a global `WebSocket`, so the polyfill is skipped.
  if (typeof WebSocket === "undefined" && !neonConfig.webSocketConstructor) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ws = require("ws") as typeof import("ws");
    neonConfig.webSocketConstructor = ws.WebSocket as unknown as typeof WebSocket;
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter, log });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
