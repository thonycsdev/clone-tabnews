import orchestrator from "tests/orchestrator";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
describe("GET /api/v1/status", () => {
  describe("Anonymous User", () => {
    test("updated_at", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.updated_at).toBeDefined();
      var parsedResponse = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedResponse);
    });
    describe("Dependencies", () => {
      describe("Database", () => {
        test("postgres_version", async () => {
          const response = await fetch("http://localhost:3000/api/v1/status");
          const responseBody = await response.json();
          expect(
            responseBody.dependencies.database.postgres_version,
          ).toBeDefined();
          expect(responseBody.dependencies.database.postgres_version).toContain(
            "PostgreSQL 16.0",
          );
        });
        test("max_connections", async () => {
          const response = await fetch("http://localhost:3000/api/v1/status");
          const responseBody = await response.json();
          expect(
            responseBody.dependencies.database.max_connections,
          ).toBeDefined();
          expect(
            responseBody.dependencies.database.max_connections,
          ).toBeGreaterThan(50);
        });
        test("active_connections", async () => {
          const response = await fetch("http://localhost:3000/api/v1/status");
          const responseBody = await response.json();
          expect(
            responseBody.dependencies.database.active_connections,
          ).toBeDefined();
          expect(responseBody.dependencies.database.active_connections).toBe(1);
        });
      });
    });
  });
});
