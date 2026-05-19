import controller from "infra/controller";
import { serialize } from "cookie";
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
  const userCookie = serialize("session_id", userSession.token, {
    maxAge: session.TIME_TO_ADD_TO_EXPIRATION_DATE,
    path: "/",
    httpOnly: false,
    secure: true,
  });
  response.setHeader("Set-Cookie", userCookie);
  return response.status(200).json(userSession);
}
