import database from "infra/database";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const database_version = databaseVersionResult.rows[0].server_version;

  const maxConnections = await database.query("SHOW max_connections");
  const maxConnectionsNumber = maxConnections.rows[0].max_connections;
  const databaseName = process.env.POSTGRES_DB;
  const activeConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname=$1;",
    values: [databaseName],
  });
  const activeConnectionsValue = activeConnections.rows[0].count;

  return response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: database_version,
        max_connections: maxConnectionsNumber,
        opened_connections: activeConnectionsValue,
      },
      webserver: {},
    },
  });
}

export default status;
