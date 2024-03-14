test("/api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  const parsedDate = new Date(responseBody.updated_at).toISOString();

  const responseBodyDependenciesDatabase = responseBody.dependencies.database;

  expect(response.status).toBe(200);

  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.updated_at).toEqual(parsedDate);

  expect(responseBodyDependenciesDatabase).toBeDefined();
  expect(responseBodyDependenciesDatabase.version).toBe("16.0");

  expect(responseBodyDependenciesDatabase.max_connections).toBeDefined();
  expect(responseBodyDependenciesDatabase.max_connections).toBe("100");

  expect(responseBodyDependenciesDatabase.opened_connections).toBeDefined();
  expect(responseBodyDependenciesDatabase.opened_connections).toBe(1);
});
