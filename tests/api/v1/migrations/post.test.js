test("/api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", { method: "POST" });
  expect(response.status).toBe(200);
  const result = await response.json();
  expect(Array.isArray(result)).toBe(true);
});
