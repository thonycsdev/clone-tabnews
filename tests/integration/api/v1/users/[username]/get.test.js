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
        //Cria um usuario no banco
        await orchestrator.createUser({
          username: "user_username",
          password: "123456",
          email: "email@email.com",
        });
        //Busca o nome `user_username` na api
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
      //Cadastra um usuario com case
      test("Existing Username", async () => {
        await orchestrator.createUser({
          username: "Unmatched",
          password: "123456",
          email: "Unmatched@email.com",
        });
        //Busca o usuario com um case diferente do que foi cadastrado
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
    test("With nonexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/random_name",
      );
      expect(response.status).toBe(404);
      const responseBody = await response.json();

      expect(responseBody.message).toBe("username nao encontrado");
    });
  });
});
