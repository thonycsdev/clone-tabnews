import database from "infra/database";
import controller from "infra/controller";
import path from "node:path";
import NodePGMigrate from "node-pg-migrate";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(postHandler);
router.post(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(_, response) {
  const nodePGMigrateDefaultConfiguration =
    await getNodePGMigrationConfiguration();
  const migratedMigrations = await NodePGMigrate(
    nodePGMigrateDefaultConfiguration,
  );

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}

async function postHandler(_, response) {
  const nodePGMigrateDefaultConfiguration =
    await getNodePGMigrationConfiguration();
  const pendingMigrations = await NodePGMigrate({
    ...nodePGMigrateDefaultConfiguration,
    dryRun: true,
  });
  return response.status(200).json(pendingMigrations);
}

async function getNodePGMigrationConfiguration() {
  let dbClient;
  dbClient = await database.getNewClient();
  return {
    dbClient: dbClient,
    dir: path.resolve("infra", "migrations"),
    dryRun: false,
    direction: "up",
    verbose: "true",
    migrationsTable: "pgMigrations",
  };
}
