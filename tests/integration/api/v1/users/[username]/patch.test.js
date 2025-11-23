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
      await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        body: JSON.stringify({
          username: "user1",
          password: "123456",
          email: "userEmail111111@email.com",
        }),
      });

      await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        body: JSON.stringify({
          username: "user2",
          password: "123456",
          email: "userEmail2222@email.com",
        }),
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
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        body: JSON.stringify({
          username: "user3",
          password: "123456",
          email: "user3@email.com",
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        body: JSON.stringify({
          username: "user4",
          password: "123456",
          email: "user4@email.com",
        }),
      });

      expect(response2.status).toBe(201);
      const response = await fetch("http://localhost:3000/api/v1/users/user3", {
        method: `PATCH`,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user4@email.com" }),
      });
      expect(response.status).toBe(400);
      const responseBody = await response.json();

      expect(responseBody.message).toBe("O email utilizado ja foi cadastrado.");
    });
    test("With new 'password'", async () => {
      await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        body: JSON.stringify({
          username: "anthony",
          password: "123456",
          email: "anthony@email.com",
        }),
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/anthony",
        {
          method: `PATCH`,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: "987654321" }),
        },
      );
      expect(response.status).toBe(200);

      const storedUser = await user.findOneByUsername("anthony");
      const comparedWithOldPassword = await password.compare(
        "123456",
        storedUser.password,
      );
      const IsCorrectPassword = await password.compare(
        "987654321",
        storedUser.password,
      );
      expect(comparedWithOldPassword).toBe(false);
      expect(IsCorrectPassword).toBe(true);
    });
    test("With unique user", async () => {
      await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        body: JSON.stringify({
          username: "uniqueUser1",
          password: "123456",
          email: "userEmail@email.com",
        }),
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/uniqueUser1",
        {
          method: `PATCH`,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "updatedUser1" }),
        },
      );
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.username).toBe("updatedUser1");
      expect(responseBody.email).toBe("userEmail@email.com");
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
  });
});
