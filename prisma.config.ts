import path from "node:path";
// @ts-nocheck
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter() {
      const { createClient } = await import("@libsql/client");
      const { PrismaLibSql } = await import("@prisma/adapter-libsql");
      const url = process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db";
      const client = createClient({
        url,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      return new PrismaLibSql(client);
    },
  },
  datasource: {
    url: process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db",
  },
});
