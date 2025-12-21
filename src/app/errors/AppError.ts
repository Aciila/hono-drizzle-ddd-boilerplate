export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public errorType = "AppError"
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestException extends AppError {
  constructor(message: string) {
    super(message, 400, "BadRequest");
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "Unauthorized");
  }
}

export class ForbiddenException extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "Forbidden");
  }
}

export class NotFoundException extends AppError {
  constructor(message = "Not Found") {
    super(message, 404, "NotFound");
  }
}

export class InternalServerErrorException extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, 500, "InternalServerError");
  }
}
