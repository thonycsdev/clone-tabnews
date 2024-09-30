import database from "infra/database";

async function status(request, response) {
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

export default status;
