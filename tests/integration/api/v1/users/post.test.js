import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous User", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
      });

      expect(response.status).toBe(201);
      const responseBody = await response.json();
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNan();
      expect(Date.parse(responseBody.created_at)).not.toBeNan();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "thonycsdev",
        email: "thonycsdev@email.com",
        password: "12345678",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
    });
  });
});
