test("/api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  expect(response.status).toBe(200);
  expect(responseBody.updated_at).toBeDefined();

  const parsedDate = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedDate);
  expect(responseBody.database_version).toBeDefined();
  expect(responseBody.database_version).toBe("16.0");
  expect(responseBody.max_connections).toBeDefined();
  expect(responseBody.max_connections).toBe("100");
  expect(responseBody.active_connections).toBeDefined();
  expect(parseInt(responseBody.active_connections)).toBeGreaterThan(0);
  expect(parseInt(responseBody.active_connections)).toBeLessThanOrEqual(
    parseInt(responseBody.max_connections)
  );

  console.log(responseBody);
});
