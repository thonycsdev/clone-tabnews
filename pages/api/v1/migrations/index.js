import migrationRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database";
export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
    dryRun: false,
  };
  if (request.method === "POST") {
    var runner = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();
    return response.status(200).json(runner);
  }
  if (request.method === "GET") {
    var runner = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: true,
    });
    await dbClient.end();
    return response.status(200).json(runner);
  }
  await dbClient.end();
  return response.status(405);
}
