import database from "infra/database";


async function cleanDatabase() {
  //todos os bancos de dados tem um schema, e o padrao e mais usado eh o public
  //drop schema vai apagar esse schema
  //o modo cascade eh por conta de outras coisas que dependem de public, vai primeiro apagar essas coisas que depende de public e entao apagar o schema public.
  //logo apos isso, se recria o schema public zeradinho
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);


test("/api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const result = await response.json();

  console.log("Node_ENV: " + process.env.NODE_ENV)
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThan(0)
});
