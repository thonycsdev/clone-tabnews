import database from "infra/database";
import { ValidationError } from "infra/errors";
async function create(userDataRequest) {
  await validateEmail(userDataRequest);
  const newUser = await runInserQuery(userDataRequest);
  return newUser;

}

async function validateEmail(userDataRequest) {

  const result = await database.query({
    text: `
      SELECT
        email
      FROM
        users u
      WHERE
        LOWER(u.email) = LOWER($1)
      
    `,
    values: [
      userDataRequest.email
    ],
  });
  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O email utilizado ja foi cadastrado.",
      action: "Utilize outro email que nao tenha sido cadastrado anteriormente."
    })
  }

}

async function runInserQuery(userDataRequest) {

  const result = await database.query({
    text: `
      INSERT INTO
      users
      (username, password, email)
      VALUES
      ($1, $2, $3)
      RETURNING *;
    `,
    values: [
      userDataRequest.username,
      userDataRequest.password,
      userDataRequest.email,
    ],
  });
  return result.rows[0];
}

const user = { create };
export default user;
