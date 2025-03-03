import controller from "infra/controller";
import { createRouter } from "next-connect";
import migrator from "models/migrator";

const router = createRouter();

router.get(postHandler);
router.post(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(_, response) {
  const pendingMigrations = await migrator.listPendingMigrations();
  if (pendingMigrations.length > 0) {
    return response.status(201).json(pendingMigrations);
  }
  return response.status(200).json(pendingMigrations);
}

async function postHandler(_, response) {
  const migratedMigrations = await migrator.runPendingMigrations();
  return response.status(200).json(migratedMigrations);
}
