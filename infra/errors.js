export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Um erro interno aconteceu!", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contate um administrator";
    this.status = 500;
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
