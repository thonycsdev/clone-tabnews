import {
  MethodsNotAllowed,
  ValidationError,
  InternalServerError,
  NotFoundError,
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

  const publicError = new InternalServerError(error, error.status_code);
  console.error(publicError);
  return response.status(publicError.status_code).json(publicError);
}

const controller = {
  errorHandlers: { onError, onNoMatch },
};
export default controller;
