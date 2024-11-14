import orchestrator from "tests/orchestrator";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
test("Get to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();
  var parsedResponse = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedResponse);
});
test("Get to /api/v1/status should return valid updated_at", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();
  var parsedResponse = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedResponse);
});
test("Get to /api/v1/status should return correct postgres version", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  expect(responseBody.dependencies.database.postgres_version).toBeDefined();
  expect(responseBody.dependencies.database.postgres_version).toContain(
    "PostgreSQL 16.0",
  );
});
test("Get to /api/v1/status should return the max connection number of the database", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  expect(responseBody.dependencies.database.max_connections).toBeGreaterThan(
    50,
  );
});
test("Get to /api/v1/status should return the active connection of the database at this given moment", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  expect(responseBody.dependencies.database.active_connections).toBeDefined();
  expect(responseBody.dependencies.database.active_connections).toBe(1);
});
