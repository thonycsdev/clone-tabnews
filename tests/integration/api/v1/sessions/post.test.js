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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "email-errado@email.com",
          password: "senha-correta",
        }),
      });

      expect(response.status).toBe(401);
      const responseBody = await response.json();

      expect(responseBody.message).toBe("Dados de autenticação não conferem")
      expect(responseBody.action).toBe("Verifique se os dados informados estão corretos")
    });
    test("With correct `email`, But incorrect `password`", async () => {
      await orchestrator.createUser({ email: "email-correto@email.com" });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "email-correto@email.com",
          password: "senha-incorreta",
        }),
      });

      expect(response.status).toBe(401);
      const responseBody = await response.json();

      expect(responseBody.message).toBe("Dados de autenticação não conferem")
      expect(responseBody.action).toBe("Verifique se os dados informados estão corretos")
    });
        test("With incorrect `email`, and incorrect `password`", async () => {
      await orchestrator.createUser();

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "email-incorreto@email.com",
          password: "senha-incorreta",
        }),
      });

      expect(response.status).toBe(401);
      const responseBody = await response.json();

      expect(responseBody.message).toBe("Dados de autenticação não conferem")
      expect(responseBody.action).toBe("Verifique se os dados informados estão corretos")
    });
  });
});
