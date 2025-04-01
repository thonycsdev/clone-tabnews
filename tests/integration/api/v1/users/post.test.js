import database from "infra/database";
import orchestrator from "tests/orchestrator";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous User", () => {
    test("With unique and valid data", async () => {
      await database.query({
        text: "INSERT INTO users (username, email) values ($1, $2);",
        values: ["thonycsdev", "thonycsdev@email.com"],
      });
      const resultFromUsersTable = await database.query("SELECT * FROM users;");
      console.log(resultFromUsersTable.rows);
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
      });
      expect(response.status).toBe(201);
    });
  });
});
