import { Client } from "pg";
import { ServiceError } from "./errors";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    var result = await client.query(queryObject);
    return result;
  } catch (error) {
    const serviceError = new ServiceError({
      message: "Erro no servico de banco de dados ou na query executada.",
      cause: error,
    });
    throw serviceError;
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
