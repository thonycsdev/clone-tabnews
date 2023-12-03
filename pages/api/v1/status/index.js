import database from "infra/database";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const result = await database.query("Select VERSION()");
  const maxConnections = await database.query("SHOW max_connections");
  const activeConnections = await database.query(
    "SELECT count(distinct(numbackends)) FROM pg_stat_database;"
  );
  const activeConnectionsNumber = activeConnections.rows[0].count;
  const maxConnectionsNumber = maxConnections.rows[0].max_connections;
  const database_version = result.rows[0].version.split(" ")[1];
  return response.status(200).json({
    updated_at: updatedAt,
    database_version,
    max_connections: maxConnectionsNumber,
    active_connections: activeConnectionsNumber,
  });
}

export default status;
