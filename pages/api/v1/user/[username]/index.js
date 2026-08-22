import user from "models/user.js";
import controller from "infra/controller";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const result = await user.findOneByUsername(username);
  return response.status(200).json(result);
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userInputData = request.body;
  const updatedUser = await user.update(username, userInputData);
  return response.status(200).json(updatedUser);
}
