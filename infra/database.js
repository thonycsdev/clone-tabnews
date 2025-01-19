import { Client } from "pg";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    var result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error({ error });
    console.log("Erro no database.js");
    throw error;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const configuration = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  };
  const client = new Client(configuration);
  await client.connect();
  return client;
}

function getSSLValues() {
  if (process.env.NODE_ENV === "production") {
    return true;
  }
  return false;
}

const database = { query, getNewClient };
export default database;
