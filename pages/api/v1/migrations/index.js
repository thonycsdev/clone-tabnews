import migrationRunner from "node-pg-migrate";
import { join } from "path";
export default async function migrations(request, response) {
  const defaultMigrationOptions = {
    databaseUrl: process.env.DATABASE_URL,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
    dryRun: false,
  };
  if (request.method === "POST") {
    var runner = await migrationRunner(defaultMigrationOptions);
    return response.status(200).json(runner);
  }
  if (request.method === "GET") {
    var runner = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: true,
    });
    return response.status(200).json(runner);
  }
  return response.status(405);
}
