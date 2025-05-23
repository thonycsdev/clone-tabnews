import retry from "async-retry";
import database from "infra/database";
import migrator from "models/migrator";
async function waitForAllServices() {
  await waitForWebServer();
}

async function waitForWebServer() {
  return retry(fetchStatusPage, {
    retries: 100,
    maxTimeout: 1000,
    onRetry: retryErroLogMessage,
  });
}

async function fetchStatusPage() {
  const response = await fetch("http://localhost:3000/api/v1/status");
  if (!response.ok) {
    throw new Error(`Fail to fetch status ${response.status}`);
  }
}

async function retryErroLogMessage(err, attempt) {
  console.log(`Error on attempt: ${attempt}. ${err.message}`);
}

async function resetDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations({ isDryRun: false });
}

const orchestrator = {
  waitForAllServices,
  resetDatabase,
  runPendingMigrations,
};
export default orchestrator;
