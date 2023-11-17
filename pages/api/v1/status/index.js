import database from "infra/database";

async function status(request, response) {
  const result = await database.query("SELECT 1 + 1 AS sum;");
  console.log(result.rows);
  return response.status(200).json({ fruta: "Banana" });
}

export default status;
