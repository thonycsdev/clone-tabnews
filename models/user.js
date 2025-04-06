import database from "infra/database";
async function create(userDataRequest) {
  console.log(userDataRequest);
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
  console.log(result.rows[0]);
  return result.rows[0];
}

const user = { create };
export default user;
