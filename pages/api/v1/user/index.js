import user from "models/user.js";
import controller from "infra/controller";
import { createRouter } from "next-connect";
import session from "models/session";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;
  const sessionObject = await session.findOneValidByToken(sessionToken);
  const userFound = await user.findOneById(sessionObject.user_id);
  return response.status(200).json(userFound);
}

async function postHandler(request, response) {
  const userData = JSON.parse(request.body);
  const newUser = await user.create(userData);
  return response.status(201).json(newUser);
}
