import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <StatusDependencies />
    </>
  );
}

function UpdatedAt() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";
  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Last Update: {updatedAtText}</div>;
}

function StatusDependencies() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (isLoading && !data) return <div>Carregando...</div>;

  return <DatabaseDependencyStatus />;
}

function DatabaseDependencyStatus() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (isLoading && !data) return <div>Carregando...</div>;

  return (
    <ul>
      <li>Postgres Version: {data.dependencies.database.postgres_version}</li>
      <li>Max Connections: {data.dependencies.database.max_connections}</li>
      <li>
        Active Connections: {data.dependencies.database.active_connections}
      </li>
    </ul>
  );
}
