import database from "infra/database";
import path from "node:path";
import NodePGMigrate from "node-pg-migrate";
async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const nodePGMigrateDefaultConfiguration = {
    dbClient: dbClient,
    dir: path.join("infra", "migrations"),
    dryRun: true,
    direction: "up",
    verbose: "true",
    migrationsTable: "pgMigrations",
  };

  if (request.method === "POST") {
    const migratedMigrations = await NodePGMigrate({
      ...nodePGMigrateDefaultConfiguration,
      dryRun: false,
    });
    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  }
  if (request.method === "GET") {
    const pendingMigrations = await NodePGMigrate({
      ...nodePGMigrateDefaultConfiguration,
    });
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  return response.status(405).end();
}
export default migrations;
