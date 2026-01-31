import controller from "infra/controller";
import { createRouter } from "next-connect";
import authentication from "models/authentication";
import { UnauthorizedError } from "infra/errors";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const data = request.body;
  try {
    const authenticatedUser = await authentication.getAuthenticatedUser(data);

    return response.status(200).json(authenticatedUser);
  } catch (error) {
    throw new UnauthorizedError({
      message: "Dados de autenticação não conferem",
      action: "Verifique se os dados informados estão corretos",
    });
  }
}
