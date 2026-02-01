import { faker } from "@faker-js/faker/.";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/sessions", () => {
  describe("Anonymous User", () => {
    test("With Incorrect `email`, But correct `password`", async () => {
      await orchestrator.createUser({ password: "senha-correta" });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email-errado@email.com",
          password: "senha-correta",
        }),
      });

      expect(response.status).toBe(401);
      const responseBody = await response.json();

      expect(responseBody.message).toBe("Dados de autenticação não conferem");
      expect(responseBody.action).toBe(
        "Verifique se os dados informados estão corretos",
      );
    });
    test("With correct `email`, But incorrect `password`", async () => {
      await orchestrator.createUser({ email: "email-correto@email.com" });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email-correto@email.com",
          password: "senha-incorreta",
        }),
      });

      expect(response.status).toBe(401);
      const responseBody = await response.json();

      expect(responseBody.message).toBe("Dados de autenticação não conferem");
      expect(responseBody.action).toBe(
        "Verifique se os dados informados estão corretos",
      );
    });
    test("With incorrect `email`, and incorrect `password`", async () => {
      await orchestrator.createUser();

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email-incorreto@email.com",
          password: "senha-incorreta",
        }),
      });

      expect(response.status).toBe(401);
      const responseBody = await response.json();

      expect(responseBody.message).toBe("Dados de autenticação não conferem");
      expect(responseBody.action).toBe(
        "Verifique se os dados informados estão corretos",
      );
    });
    test("With correct `email`, and correct `password`", async () => {
      const correctEmail = faker.internet.email();
      const correctPassword = faker.internet.password();
      const createdUser = await orchestrator.createUser({
        email: correctEmail,
        password: correctPassword,
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: correctEmail,
          password: correctPassword,
        }),
      });

      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        token: responseBody.token,
        user_id: createdUser.id,
        updated_at: responseBody.updated_at,
        created_at: responseBody.created_at,
        expires_at: responseBody.expires_at
      })
      const TIME_TO_ADD_TO_EXPIRATION_DATE = 60 * 60 * 24 * 30 * 1000; // 30 Days
      const createdAt = new Date(responseBody.created_at)
      createdAt.setMilliseconds(0)
      createdAt.setSeconds(0)

            const expiresAt = new Date(responseBody.expires_at)
      expiresAt.setMilliseconds(0)
      expiresAt.setSeconds(0)
      expect(expiresAt - createdAt).toBe(TIME_TO_ADD_TO_EXPIRATION_DATE)
    });
  });
});
