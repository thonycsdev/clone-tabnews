import database from "infra/database";
import { UnauthorizedError } from "infra/errors";
import crypto from "node:crypto";
const TIME_TO_ADD_TO_EXPIRATION_DATE = 60 * 60 * 24 * 30 * 1000; // 30 Days

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expirationDate = new Date(Date.now() + TIME_TO_ADD_TO_EXPIRATION_DATE);
  const newSession = await runInsertQuery(token, userId, expirationDate);
  return newSession;

  async function runInsertQuery(token, userId, expirationDate) {
    const sessionRow = await database.query({
      text: ` 
                INSERT INTO sessions (token, user_id, expires_at) VALUES ($1,$2,$3)
                RETURNING *;
            `,
      values: [token, userId, expirationDate],
    });
    return sessionRow.rows[0];
  }
}

async function findOneValidByToken(sessionToken) {
  const sessionFound = await runSelectQuery(sessionToken);
  return sessionFound;

  async function runSelectQuery(sessionToken) {
    const results = await database.query({
      text: `
        SELECT 
        *
        FROM
          sessions
        WHERE
          token = $1
          AND expires_at > NOW()
        LIMIT
          1
        ;
      `,
      values: [sessionToken],
    });
    if (results.rowCount == 0) {
      throw new UnauthorizedError({
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
      });
    }
    return results.rows[0];
  }
}
const session = { create, findOneValidByToken, TIME_TO_ADD_TO_EXPIRATION_DATE };
export default session;
