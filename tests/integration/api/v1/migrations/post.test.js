import database from "infra/database";
import orchestrator from "tests/orchestrator";
beforeAll(async () => {
  await database.query("drop schema public cascade; create schema public;");
  await orchestrator.waitForAllServices();
});

test("/api/v1/migrations/ POST should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);
  const responseBody1 = await response1.json();
  expect(Array.isArray(responseBody1)).toBeTruthy();
  expect(responseBody1.length).toBeGreaterThanOrEqual(1);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);
  const responseBody = await response2.json();
  expect(Array.isArray(responseBody)).toBeTruthy();
  expect(responseBody.length).toBe(0);
});
