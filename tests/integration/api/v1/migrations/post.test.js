import orchestrator from "tests/orchestrator";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous User", () => {
    describe("Running pending migrations", () => {
      test("For the FIRST time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response.status).toBe(201);
        const responseBody1 = await response.json();
        expect(Array.isArray(responseBody1)).toBeTruthy();
        expect(responseBody1.length).toBeGreaterThanOrEqual(1);
      });
      test("For the SECOND time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBe(0);
      });
    });
  });
});
