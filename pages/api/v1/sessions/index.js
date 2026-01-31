import controller from "infra/controller";
import { createRouter } from "next-connect";
import authentication from "models/authentication";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const data = request.body;
  const authenticatedUser = await authentication.getAuthenticatedUser(data);
  return response.status(200).json(authenticatedUser);
}
