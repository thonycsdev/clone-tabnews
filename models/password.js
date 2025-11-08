import bcryptjs from "bcryptjs";
async function hash(password) {
  const rounds = 8;
  return await bcryptjs.hash(password, rounds);
}

async function compare(password, storedValue) {
  return await bcryptjs.compare(password, storedValue);
}

const password = { hash, compare };

export default password;
