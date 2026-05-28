import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "apps/api/prisma/schema.prisma",
  migrations: {
    seed: "tsx apps/api/prisma/seed.ts"
  }
});
