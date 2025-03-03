import database from "infra/database";
import path from "node:path";
import NodePGMigrate from "node-pg-migrate";
import { ServiceError } from "infra/errors";

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const nodePGMigrateDefaultConfiguration = getNodePGMigrationConfiguration();
    const migrations = await NodePGMigrate({
      ...nodePGMigrateDefaultConfiguration,
      dbClient,
    });
    return migrations;
  } catch (error) {
    throw new ServiceError(error);
  } finally {
    dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const nogePGMigrateDefaultConfiguration = getNodePGMigrationConfiguration();
    const migrateMigrations = await NodePGMigrate({
      ...nogePGMigrateDefaultConfiguration,
      dryRun: false,
      dbClient,
    });
    return migrateMigrations;
  } catch (error) {
    throw new ServiceError(error);
  } finally {
    dbClient?.end();
  }
}

function getNodePGMigrationConfiguration() {
  return {
    dir: path.resolve("infra", "migrations"),
    dryRun: false,
    direction: "up",
    verbose: "true",
    migrationsTable: "pgMigrations",
  };
}

const migrator = { listPendingMigrations, runPendingMigrations };
export default migrator;
