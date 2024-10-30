import database from "infra/database";
import path from "node:path";
import NodePGMigrate from "node-pg-migrate";
async function migrations(request, response) {
  const allowedMethods = ["POST", "GET"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method: ${request.method} not allowed`,
    });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

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

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      return response.status(200).json(migratedMigrations);
    }
    if (request.method === "GET") {
      const pendingMigrations = await NodePGMigrate({
        ...nodePGMigrateDefaultConfiguration,
      });
      return response.status(200).json(pendingMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
export default migrations;
