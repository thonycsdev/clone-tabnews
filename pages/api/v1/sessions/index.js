import controller from "infra/controller";
import { createRouter } from "next-connect";
import authentication from "models/authentication";
import session from "models/session";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const data = request.body;
  const authenticatedUser = await authentication.getAuthenticatedUser(data);
  const userSession = await session.create(authenticatedUser.id);
  return response.status(200).json(userSession);
}
