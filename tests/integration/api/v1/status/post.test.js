import orchestrator from "tests/orchestrator";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
describe("POST /api/v1/status", () => {
  describe("Anonymous User", () => {
    test("Method Not Allowed", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);
      const responseBody = await response.json();
      expect(responseBody.message).toBe("Metodo nao Permitido");
      expect(responseBody.name).toBe("MethodNotAllowed");
      expect(responseBody.status_code).toBe(405);
      expect(responseBody.action).toBe("Mude o tipo da sua request");
    });
  });
});
