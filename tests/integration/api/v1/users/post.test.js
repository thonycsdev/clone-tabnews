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
        body: JSON.stringify({
          username: "anthonycoutinho",
          password: "123456",
          email: "anthony@coutinho.dev",
        }),
      });

      expect(response.status).toBe(201);
      const responseBody = await response.json();
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    });

    test("With duplicate email", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        body: JSON.stringify({
          username: "duplicateUser",
          password: "123456",
          email: "duplicated@email.com",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        body: JSON.stringify({
          username: "duplicateUser2",
          password: "123456",
          email: "Duplicated@email.com",
        }),
      });

      expect(response2.status).toBe(400);

      const responseBody2 = await response2.json();
      expect(responseBody2.name).toBe("ValidationError");
      expect(responseBody2.message).toBe(
        "O email utilizado ja foi cadastrado.",
      );
      expect(responseBody2.action).toBe(
        "Utilize outro email que nao tenha sido cadastrado anteriormente.",
      );
      expect(responseBody2.status_code).toBe(400);
    });
    test("With duplicate username", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        body: JSON.stringify({
          username: "usernameDuplicated",
          password: "123456",
          email: "userEmail1@email.com",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        body: JSON.stringify({
          username: "usERnameDuplicateD",
          password: "123456",
          email: "userEmail2@email.com",
        }),
      });

      expect(response2.status).toBe(400);

      const responseBody2 = await response2.json();
      expect(responseBody2.name).toBe("ValidationError");
      expect(responseBody2.message).toBe(
        "O username utilizado ja foi cadastrado.",
      );
      expect(responseBody2.action).toBe(
        "Utilize outro username que nao tenha sido cadastrado anteriormente.",
      );
      expect(responseBody2.status_code).toBe(400);
    });
  });
});
