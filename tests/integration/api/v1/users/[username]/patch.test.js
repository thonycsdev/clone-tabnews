import orchestrator from "tests/orchestrator";
import user from "models/user.js";
import password from "models/password.js";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous User", () => {
    test("With nonexistent 'username'", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/usuario-inexistente",
        { method: `PATCH` },
      );
      expect(response.status).toBe(404);
      const responseBody = await response.json();

      expect(responseBody.message).toBe("username nao encontrado");
    });
    test("With duplicated 'username'", async () => {
      await orchestrator.createUser({
        username: "user1",
      });
      await orchestrator.createUser({
        username: "user2",
      });

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: `PATCH`,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "user1" }),
      });
      expect(response.status).toBe(400);
      const responseBody = await response.json();

      expect(responseBody.message).toBe("Username não disponível.");
    });
    test("With duplicated 'email'", async () => {
      const { email } = await orchestrator.createUser();
      const { username } = await orchestrator.createUser();

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${username}`,
        {
          method: `PATCH`,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      expect(response.status).toBe(400);
      const responseBody = await response.json();

      expect(responseBody.message).toBe("O email utilizado ja foi cadastrado.");
    });
    test("With new 'password'", async () => {
      const { username, password: userPassword } =
        await orchestrator.createUser();

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${username}`,
        {
          method: `PATCH`,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: "newPassword" }),
        },
      );
      expect(response.status).toBe(200);

      const storedUser = await user.findOneByUsername(username);
      const comparedWithOldPassword = await password.compare(
        userPassword,
        storedUser.password,
      );
      const IsCorrectPassword = await password.compare(
        "newPassword",
        storedUser.password,
      );
      expect(comparedWithOldPassword).toBe(false);
      expect(IsCorrectPassword).toBe(true);
    });
    test("With unique user", async () => {
      const { username, email } = await orchestrator.createUser();

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${username}`,
        {
          method: `PATCH`,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "anthony" }),
        },
      );
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.username).not.toBe(username);
      expect(responseBody.email).toBe(email);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
  });
});
