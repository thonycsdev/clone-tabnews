class BaseError extends Error {
  constructor(error) {
    super(error);
  }
  toJSON() {
    return {
      message: this.message,
      name: this.name,
      status_code: this.status,
      action: this.action,
    };
  }
}
export class InternalServerError extends BaseError {
  constructor({ cause }) {
    super("Um erro interno aconteceu!", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contate um administrator";
    this.status = 500;
  }
}
export class MethodsNotAllowed extends BaseError {
  constructor() {
    super("Metodo nao Permitido");
    this.name = "MethodNotAllowed";
    this.action = "Mude o tipo da sua request";
    this.status = 405;
  }
}
