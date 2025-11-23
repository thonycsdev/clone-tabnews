import database from "infra/database";
import password from "models/password.js";
import { NotFoundError, ValidationError } from "infra/errors";
async function create(userDataRequest) {
  await validateEmail(userDataRequest);
  await validateUserName(userDataRequest);
  await hashPasswordInObject(userDataRequest);
  const newUser = await runInserQuery(userDataRequest);
  return newUser;
}
async function update(username, userInputData) {
  const user = await findOneByUsername(username);
  if ("username" in userInputData) {
    await validateUserName(userInputData);
  }
  if ("email" in userInputData) {
    await validateEmail(userInputData);
  }
  if ("password" in userInputData) {
    await hashPasswordInObject(userInputData);
  }

  const userWithNewValues = { ...user, ...userInputData };
  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;
}
async function hashPasswordInObject(userDataRequest) {
  userDataRequest.password = await password.hash(userDataRequest.password);
}
async function findOneByUsername(username) {
  const user = await runSelectQuery(username);
  return user;

  async function runSelectQuery(username) {
    const result = await database.query({
      text: `
      SELECT
        *
      FROM
        users u
      WHERE
        LOWER(u.username) = LOWER($1)
      LIMIT
        1;
    `,
      values: [username],
    });

    if (result.rowCount == 0) {
      throw new NotFoundError({
        message: "username nao encontrado",
      });
    }

    return result.rows[0];
  }
}
async function validateUserName(userInputData) {
  const result = await database.query({
    text: `
      SELECT
        username
      FROM
        users u
      WHERE
        LOWER(u.username) = LOWER($1)
      
    `,
    values: [userInputData.username],
  });
  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "Username não disponível.",
      action:
        "Utilize outro username que nao tenha sido cadastrado anteriormente.",
    });
  }
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
    values: [userDataRequest.email],
  });
  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O email utilizado ja foi cadastrado.",
      action:
        "Utilize outro email que nao tenha sido cadastrado anteriormente.",
    });
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
async function runUpdateQuery(userWithNewValues) {
  const result = await database.query({
    text: `
    UPDATE
      users
    SET
      username = $2,
      email = $3,
      password = $4,
      updated_at = timezone('utc', now())
    WHERE 
      id = $1
    RETURNING
      *
    ;
    `,
    values: [
      userWithNewValues.id,
      userWithNewValues.username,
      userWithNewValues.email,
      userWithNewValues.password,
    ],
  });
  return result.rows[0];
}

const user = { create, findOneByUsername, update };
export default user;
