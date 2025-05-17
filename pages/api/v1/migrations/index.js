import controller from "infra/controller";
import { createRouter } from "next-connect";
import migrator from "models/migrator";

const router = createRouter();

router.get(postHandler);
router.post(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(_, response) {
  const migratedMigrations = await migrator.runPendingMigrations({
    isDryRun: false,
  });

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}

async function postHandler(_, response) {
  const pendingMigrations = await migrator.runPendingMigrations({
    isDryRun: true,
  });
  return response.status(200).json(pendingMigrations);
}
