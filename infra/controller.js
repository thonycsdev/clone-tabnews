import {
  MethodsNotAllowed,
  ValidationError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "infra/errors";

function onNoMatch(_, response) {
  const publicError = new MethodsNotAllowed();
  return response.status(publicError.status_code).json(publicError);
}

function onError(error, _, response) {
  if (error instanceof ValidationError)
    return response.status(error.status_code).json(error);

  if (error instanceof NotFoundError)
    return response.status(error.status_code).json(error);

  if (error instanceof UnauthorizedError)
    return response.status(error.status_code).json(error);

  console.error(error);
  const publicError = new InternalServerError(error, error.status_code);
  return response.status(publicError.status_code).json(publicError);
}

const controller = {
  errorHandlers: { onError, onNoMatch },
};
export default controller;
