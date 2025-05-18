import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous User", () => {
    describe("Exact Match", () => {
      test("Existing Username", async () => {
        const response1 = await fetch("http://localhost:3000/api/v1/users", {
          method: "POST",
          body: JSON.stringify({
            username: "user_username",
            password: "123456",
            email: "email@email.com",
          }),
        });
        expect(response1.status).toBe(201);

        const result = await fetch(
          "http://localhost:3000/api/v1/users/user_username",
        );
        expect(result.status).toBe(200);
        const responseBody = await result.json();
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(responseBody.username).toBe("user_username");
        expect(responseBody.email).toBe("email@email.com");
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      });
    });
    describe("Unmatched Case", () => {
      test("Existing Username", async () => {
        const response1 = await fetch("http://localhost:3000/api/v1/users", {
          method: "POST",
          body: JSON.stringify({
            username: "Unmatched",
            password: "123456",
            email: "Unmatched@email.com",
          }),
        });
        expect(response1.status).toBe(201);

        const result = await fetch(
          "http://localhost:3000/api/v1/users/unMatched",
        );
        expect(result.status).toBe(200);
        const responseBody = await result.json();
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(responseBody.username).toBe("Unmatched");
        expect(responseBody.email).toBe("Unmatched@email.com");
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      });
    });
  });
});
