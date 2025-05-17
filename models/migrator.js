import database from "infra/database";
import path from "node:path";
import NodePGMigrate from "node-pg-migrate";

async function runPendingMigrations({ isDryRun } = { isDryRun: true }) {
  const nodePGMigrateDefaultConfiguration =
    await getNodePGMigrationConfiguration();
  const migratedMigrations = await NodePGMigrate({
    ...nodePGMigrateDefaultConfiguration,
    dryRun: isDryRun,
  });

  nodePGMigrateDefaultConfiguration.dbClient.end();

  return migratedMigrations;
}

async function getNodePGMigrationConfiguration() {
  let dbClient;
  dbClient = await database.getNewClient();
  return {
    dbClient: dbClient,
    dir: path.resolve("infra", "migrations"),
    dryRun: false,
    direction: "up",
    log: () => {},
    migrationsTable: "pgMigrations",
  };
}

const migrator = { runPendingMigrations };
export default migrator;
