class BaseError extends Error {
  constructor(error) {
    super(error);
  }
  toJSON() {
    return {
      message: this.message,
      name: this.name,
      status_code: this.status_code,
      action: this.action,
    };
  }
}
export class ServiceError extends BaseError {
  constructor({ cause, message }) {
    super(message || "Servico indisponivel no momento.", {
      cause,
    });

    this.name = "ServiceError";
    this.action = "Verifique se o servico esta disponivel.";
    this.status_code = 503;
  }
}
export class InternalServerError extends BaseError {
  constructor({ cause, status_code }) {
    super("Um erro interno aconteceu!", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contate um administrator";
    this.status_code = status_code || 500;
  }
}
export class MethodsNotAllowed extends BaseError {
  constructor() {
    super("Metodo nao Permitido");
    this.name = "MethodNotAllowed";
    this.action = "Mude o tipo da sua request";
    this.status_code = 405;
  }
}
