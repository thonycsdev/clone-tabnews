import user from "models/user";
import password from "models/password";
import { NotFoundError, UnauthorizedError } from "infra/errors";

async function getAuthenticatedUser(data) {
  try {
    const storedUser = await findUserByEmail(data.email);
    await validatePassword(data.password, storedUser.password);
    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem",
        action: "Verifique se os dados informados estão corretos",
      });
    }
  }
  async function findUserByEmail(userEmail) {
    try {
      const storedUser = await user.findOneByEmail(userEmail);
      return storedUser;
    } catch (error) {
      //O erro que findOne gera, precisa ser oculto para evitar vazamento de informacoes
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Senha não confere.",
          action: "Verifique se o dado está correto.",
        });
      }
      throw error;
    }
  }
  async function validatePassword(providedPassword, storedPassword) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );
    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Senha não confere.",
        action: "Verifique se o dado está correto.",
      });
    }
  }
}

const authentication = { getAuthenticatedUser };
export default authentication;
