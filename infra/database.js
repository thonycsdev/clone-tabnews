import { Client } from "pg";

async function query(queryObject) {
  const cliente = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: process.env.NODE_ENV == "production" ? true : false,
  });
  try {
    await cliente.connect();
    const result = await cliente.query(queryObject);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await cliente.end();
  }
}
export default {
  query: query,
};
