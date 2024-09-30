import { Client } from "pg";

async function query(queryObject) {
  const client = await getNewClient();
  try {
    var result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const configuration = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  };
  const client = new Client(configuration);
  await client.connect();
  return client;
}
export default { query, getNewClient };
