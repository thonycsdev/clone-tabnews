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
export class NotFoundError extends BaseError {
  constructor({ message, action }) {
    super(message ?? "O que foi buscado, nao foi encontrato.", action);
    this.name = "NotFoundError";
    this.action = action ?? "Verifique as dados fornecidos.";
    this.status_code = 404;
  }
}

export class ValidationError extends BaseError {
  constructor({ message, action }) {
    super(message ?? "Um erro de validacao ocorreu.", action);
    this.name = "ValidationError";
    this.action = action ?? "Verifique a disponibilidade do servico.";
    this.status_code = 400;
  }
}
