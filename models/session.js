import database from "infra/database";
const TIME_TO_ADD_TO_EXPIRATION_DATE = 60 * 60 * 24 * 30 * 1000; // 30 Days
import crypto from "node:crypto";
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
    console.log({sessionRow})
    return sessionRow.rows[0];
  }
}
const session = { create };
export default session;
