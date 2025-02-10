import {
  InternalServerError,
  MethodsNotAllowed as MethodNotAllowed,
} from "infra/errors";

function onNoMatch(_, response) {
  const publicError = new MethodNotAllowed();
  return response.status(publicError.status_code).json(publicError);
}

function onError(error, _, response) {
  const publicError = new InternalServerError(error, error.status_code);
  console.error(publicError);
  return response.status(publicError.status_code).json(publicError);
}

const controller = {
  errorHandlers: { onError, onNoMatch },
};
export default controller;
