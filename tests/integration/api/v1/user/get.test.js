import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";
import session from "models/session";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/user", () => {
  describe("Default User", () => {
    test("With valid session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UserWithValidSession",
      });

      const session = await orchestrator.createSession(createdUser.id);
      const result = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${session.token}`,
        },
      });
      expect(result.status).toBe(200);
      const responseBody = await result.json();
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(responseBody.username).toBe("UserWithValidSession");
      expect(responseBody.email).toBe(createdUser.email);
    });
    test("With nonexistent session", async () => {
      const session_token = "123abc";
      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${session_token}`,
        },
      });
      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
        status_code: 401,
      });
    });
    test("With expired session", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.TIME_TO_ADD_TO_EXPIRATION_DATE),
      });

      const createdUser = await orchestrator.createUser();

      const createdSession = await orchestrator.createSession(createdUser.id);

      jest.useRealTimers();

      const result = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${createdSession.token}`,
        },
      });
      expect(result.status).toBe(401);
      const responseBody = await result.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
        status_code: 401,
      });
    });
  });
});
