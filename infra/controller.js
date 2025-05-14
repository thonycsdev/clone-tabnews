import {
  MethodsNotAllowed
} from "infra/errors";

function onNoMatch(_, response) {
  const publicError = new MethodsNotAllowed();
  return response.status(publicError.status_code).json(publicError);
}

function onError(error, _, response) {
  const publicError = error;
  console.error(publicError);
  return response.status(publicError.status_code).json(publicError);
}

const controller = {
  errorHandlers: { onError, onNoMatch },
};
export default controller;
