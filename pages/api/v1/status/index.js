import database from "infra/database";
import {
  InternalServerError,
  MethodsNotAllowed as MethodNotAllowed,
} from "infra/errors";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(status);

export default router.handler({
  onNoMatch: noMatchHTTPMethodHandler,
  onError: internalErrorHandler,
});

function noMatchHTTPMethodHandler(_, response) {
  const publicError = new MethodNotAllowed();
  console.log({ publicError });
  return response.status(publicError.status).json(publicError);
}

function internalErrorHandler(error, _, response) {
  const publicError = new InternalServerError(error);
  return response.status(500).json(publicError);
}
async function status(_, response) {
  const updatedAt = new Date().toISOString();
  const postgresVersion = await database.query("SELECT version()");
  const maxConnections = await database.query("SHOW max_connections");
  const databaseName = process.env.POSTGRES_DB;
  const activeConnections = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity psa where psa.datname=$1",
    values: [databaseName],
  });
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        postgres_version: postgresVersion.rows[0].version,
        max_connections: +maxConnections.rows[0].max_connections,
        active_connections: activeConnections.rows[0].count,
      },
    },
  });
}
