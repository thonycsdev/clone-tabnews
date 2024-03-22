import database from "infra/database";


test("/api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const result = await response.json();
   
  console.log(process.env.DATABASE_URL)
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThan(0)
});
